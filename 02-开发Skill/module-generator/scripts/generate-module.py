# -*- coding: utf-8 -*-
"""仿美团网站 NestJS 业务模块生成器。

根据 templates/ 下的模板，生成一个完整业务模块的代码与 TypeORM 数据库迁移文件。

用法:
    py generate-module.py <ModuleName> [table_name]

示例:
    py generate-module.py Order
    py generate-module.py Order t_order

规则:
    ModuleName 使用大驼峰（PascalCase），如 Order、Coupon、UserAddress。
    table_name 缺省时自动推导为 t_ 前缀的 snake_case（如 t_order、t_user_address）。
"""
import os
import re
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(HERE, "..", "templates")
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))

# 模板文件名 -> 输出相对路径（占位符在渲染时替换）
TEMPLATES = {
    "module.ts.tpl": "backend/src/modules/{moduleKebab}/{moduleKebab}.module.ts",
    "controller.ts.tpl": "backend/src/modules/{moduleKebab}/{moduleKebab}.controller.ts",
    "service.ts.tpl": "backend/src/modules/{moduleKebab}/{moduleKebab}.service.ts",
    "repository.ts.tpl": "backend/src/modules/{moduleKebab}/{moduleKebab}.repository.ts",
    "entity.ts.tpl": "backend/src/modules/{moduleKebab}/entities/{entityKebab}.entity.ts",
    "create-dto.ts.tpl": "backend/src/modules/{moduleKebab}/dto/create-{moduleKebab}.dto.ts",
    "response-dto.ts.tpl": "backend/src/modules/{moduleKebab}/dto/{moduleKebab}-response.dto.ts",
    "migration.ts.tpl": "backend/src/database/migrations/{timestamp}-Create{ModuleName}.ts",
}


def to_words(name):
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", name).lower()


def to_kebab(name):
    return to_words(name)


def to_snake(name):
    return to_words(name).replace("-", "_")


def to_camel(name):
    return name[0].lower() + name[1:] if name else name


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)

    module = sys.argv[1]
    if not re.match(r"^[A-Z][A-Za-z0-9]+$", module):
        print("错误：ModuleName 必须是大驼峰，如 Order、Coupon、UserAddress")
        sys.exit(2)

    kebab = to_kebab(module)
    camel = to_camel(module)
    table = sys.argv[2] if len(sys.argv) > 2 else "t_" + to_snake(module)
    timestamp = str(int(time.time() * 1000))

    values = {
        "ModuleName": module,
        "moduleName": camel,
        "moduleKebab": kebab,
        "Entity": module,
        "entityKebab": kebab,
        "table": table,
        "timestamp": timestamp,
    }

    for tpl, rel in TEMPLATES.items():
        src = os.path.join(TEMPLATE_DIR, tpl)
        if not os.path.exists(src):
            print("警告：模板不存在 {}，跳过".format(src))
            continue
        with open(src, encoding="utf-8") as f:
            content = f.read()
        for key, val in values.items():
            content = content.replace("{{" + key + "}}", val)
        out = os.path.join(ROOT, rel.format(**values))
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            f.write(content)
        print("生成 " + os.path.relpath(out, ROOT))

    print("\n请运行 scripts/check-layering.py 校验模块依赖方向。")


if __name__ == "__main__":
    main()
