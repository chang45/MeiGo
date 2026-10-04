# -*- coding: utf-8 -*-
"""扫描仿美团 NestJS 后端源码，输出模块清单与接口清单，用于回填《架构设计文档》。

扫描 backend/src/modules 下的一级子目录作为功能模块，聚合每个模块内的 controller /
service / repository / entity / dto 文件，并提取 Controller 的路由。输出 Markdown 表格，
可直接粘贴到文档的 L2 / V2 / L6 章节。

用法:
    py scan-structure.py [backend/src]
"""
import os
import re
import sys

DEFAULT_ROOT = "backend/src"
KINDS = ["controller", "service", "repository", "entity", "dto"]


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ROOT
    modules_dir = os.path.join(root, "modules")
    if not os.path.isdir(modules_dir):
        print("错误：目录不存在 {}".format(modules_dir))
        sys.exit(1)

    data = {}
    controllers = []
    for feature in sorted(os.listdir(modules_dir)):
        fdir = os.path.join(modules_dir, feature)
        if not os.path.isdir(fdir):
            continue
        data[feature] = {k: [] for k in KINDS}
        for base, _dirs, files in os.walk(fdir):
            for f in files:
                if not f.endswith(".ts"):
                    continue
                name = f[:-3]
                path = os.path.join(base, f)
                if name.endswith(".controller"):
                    data[feature]["controller"].append(name)
                    controllers.append(path)
                elif name.endswith(".service"):
                    data[feature]["service"].append(name)
                elif name.endswith(".repository"):
                    data[feature]["repository"].append(name)
                elif name.endswith(".entity"):
                    data[feature]["entity"].append(name)
                elif base.endswith("dto"):
                    data[feature]["dto"].append(name)

    print("## 后端模块清单（自动生成）\n")
    print("| 模块 | controller | service | repository | entity | dto |")
    print("|------|-----------|---------|------------|--------|-----|")
    for feature in sorted(data):
        cells = [feature]
        for k in KINDS:
            items = data[feature][k]
            cells.append("、".join(sorted(items)) if items else "—")
        print("| " + " | ".join(cells) + " |")

    print("\n## 接口清单（自动提取）\n")
    for path in controllers:
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
        class_name = os.path.basename(path)[:-3]
        base = ""
        bm = re.search(r"@Controller\(['\"]([^'\"]+)", src)
        if bm:
            base = bm.group(1)
        for m in re.finditer(r"@(Get|Post|Put|Delete|Patch)\(?\s*(?:['\"]([^'\"]*)['\"])?\s*\)?", src):
            method = m.group(1).upper()
            sub = m.group(2) or ""
            full = base.rstrip("/")
            if sub:
                full = full + "/" + sub.lstrip("/")
            print("- {} {} {}".format(method, full, class_name))


if __name__ == "__main__":
    main()
