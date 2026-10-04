# -*- coding: utf-8 -*-
"""校验仿美团 NestJS 后端模块依赖方向。

规则:
    1. Controller 不得依赖 Repository（业务必须委托 Service）
    2. Service 不得依赖 Controller
    3. Repository 不得依赖 Service
    4. 跨业务模块禁止相对路径直连，只能通过目标模块 exports 的 provider 注入
    5. 禁止使用 console.log，日志统一使用 NestJS Logger

用法:
    py check-layering.py [backend/src]
"""
import os
import re
import sys

DEFAULT_ROOT = "backend/src"
MODULES_DIR = "modules"


def rel_parts(root, path):
    return os.path.relpath(path, root).split(os.sep)


def feature_of(root, path):
    parts = rel_parts(root, path)
    if MODULES_DIR in parts:
        i = parts.index(MODULES_DIR)
        if i + 1 < len(parts):
            return parts[i + 1]
    return None


def role_of(filename):
    if filename.endswith(".controller.ts"):
        return "controller"
    if filename.endswith(".service.ts"):
        return "service"
    if filename.endswith(".repository.ts"):
        return "repository"
    if filename.endswith(".module.ts"):
        return "module"
    return "other"


def resolve_import(root, file_path, imp):
    """把相对导入解析成不含扩展名的目标路径，用于判断目标所属模块。"""
    if not imp.startswith("."):
        return None
    base = os.path.dirname(file_path)
    target = os.path.normpath(os.path.join(base, imp))
    for suffix in (".ts", ".js"):
        if target.endswith(suffix):
            target = target[: -len(suffix)]
            break
    if target.endswith("/index"):
        target = target[: -len("/index")]
    return target


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ROOT
    errors = []
    checked = 0

    for base, _dirs, files in os.walk(root):
        for f in files:
            if not f.endswith(".ts"):
                continue
            path = os.path.join(base, f)
            feature = feature_of(root, path)
            if feature is None:
                continue
            role = role_of(f)
            checked += 1
            with open(path, encoding="utf-8") as fh:
                src = fh.read()

            if "console.log(" in src:
                errors.append("{}: 禁止使用 console.log，请使用 NestJS Logger".format(f))

            for imp in re.findall(r"from\s+['\"]([^'\"]+)['\"]", src):
                if imp.startswith("."):
                    target = resolve_import(root, path, imp)
                    if target is not None:
                        target_feature = feature_of(root, target)
                        if target_feature is not None and target_feature != feature:
                            errors.append(
                                "{}: 跨模块禁止相对路径直连 {}，应通过 module exports 注入".format(f, imp)
                            )

                if role == "controller" and "repository" in imp:
                    errors.append("{}: Controller 不得依赖 Repository ({})".format(f, imp))
                if role == "service" and "controller" in imp:
                    errors.append("{}: Service 不得依赖 Controller ({})".format(f, imp))
                if role == "repository" and "service" in imp:
                    errors.append("{}: Repository 不得依赖 Service ({})".format(f, imp))

    print("已检查 {} 个文件".format(checked))
    if errors:
        print("架构约束校验未通过：")
        for e in errors:
            print("  - " + e)
        sys.exit(1)
    print("架构约束校验通过")


if __name__ == "__main__":
    main()
