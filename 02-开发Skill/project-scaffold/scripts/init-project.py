# -*- coding: utf-8 -*-
"""仿美团网站（NestJS + React）项目脚手架初始化脚本。

用法:
    py init-project.py [目标目录]

不传目标目录时，默认把工程建到本 Skill 包所在的仓库根（即 02-开发Skill 的上一级）。
脚本会创建后端 NestJS 目录、前端 React 目录与文档目录，并打印目录树，
用于对照《开发架构视图 V2》。
"""
import os
import sys

BACKEND_DIRS = [
    "backend/src/common/interceptors",
    "backend/src/common/filters",
    "backend/src/common/decorators",
    "backend/src/common/dto",
    "backend/src/common/constants",
    "backend/src/config",
    "backend/src/database/migrations",
    "backend/src/redis",
    "backend/src/modules",
    "backend/test",
]
FRONTEND_DIRS = [
    "frontend/src/api",
    "frontend/src/pages",
    "frontend/src/components",
    "frontend/src/store",
    "frontend/src/router",
    "frontend/src/utils",
]
DOC_DIRS = [
    "docs/api",
]


def main():
    if len(sys.argv) > 1:
        root = sys.argv[1]
    else:
        # 脚本位于 02-开发Skill/project-scaffold/scripts 下，上溯三级到仓库根
        root = os.path.abspath(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")
        )

    dirs = BACKEND_DIRS + FRONTEND_DIRS + DOC_DIRS
    for d in dirs:
        os.makedirs(os.path.join(root, d), exist_ok=True)

    gitignore = os.path.join(root, ".gitignore")
    if not os.path.exists(gitignore):
        with open(gitignore, "w", encoding="utf-8") as f:
            f.write("node_modules/\ndist/\nbuild/\ncoverage/\n.env\n*.log\n.idea/\n")

    print("已初始化项目目录：{}".format(root))
    for d in dirs:
        print("  " + d)
    print("\n请再补充: backend/package.json、backend/.env.example、docker-compose.yml、frontend/package.json")


if __name__ == "__main__":
    main()
