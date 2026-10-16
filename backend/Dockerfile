FROM node:20-alpine

WORKDIR /app

# 先拷贝依赖清单，利用 Docker 层缓存
COPY package*.json ./
RUN npm ci

# 拷贝源码并编译
COPY . .
RUN npm run build

EXPOSE 3000

# 启动时先执行数据库迁移，再启动服务
CMD ["sh", "-c", "npm run migration:run && node dist/main"]
