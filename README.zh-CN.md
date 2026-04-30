# NetCut 云端剪切板

NetCut 是一个部署在 Cloudflare Workers 上的云端剪切板工具，使用 Hono、Cloudflare D1 和浏览器端加密实现。打开页面后输入一个名称即可进入对应剪切板，同一个名称会打开同一份内容，不同名称互不影响。

已部署地址：

```txt
https://netcut.zyc630089289.workers.dev
```

## 功能

- 无需登录，输入名称即可创建或打开剪切板。
- 内容在浏览器端加密后保存到 Cloudflare D1。
- 支持多个标签页内容一起保存。
- 支持复制内容、复制链接、下载文本和二维码分享。
- 支持访问密码、保存时长和阅后即焚。
- 过期内容读取时会被隐藏，并由 Cron 定时清理。

## 本地开发

安装依赖：

```sh
npm install
```

应用本地 D1 迁移：

```sh
npm run db:migrate:local
```

启动本地 Worker：

```sh
npm run dev
```

页面和 API 默认运行在：

```txt
http://127.0.0.1:8787
```

如果端口被占用，Wrangler 会自动切换到其他端口。

## 常用命令

类型检查：

```sh
npm run typecheck
```

生产构建：

```sh
npm run build
```

部署到 Cloudflare：

```sh
npm run deploy
```

应用远程 D1 迁移：

```sh
npm run db:migrate:remote
```

## API 简介

读取剪切板：

```sh
curl http://127.0.0.1:8787/api/notes/demo1234
```

保存剪切板：

```sh
curl -X PUT http://127.0.0.1:8787/api/notes/demo1234 \
  -H "Content-Type: application/json" \
  -d '{
    "ciphertext": "encrypted-payload",
    "iv": "iv",
    "ttl_seconds": 3600,
    "permission": "editable",
    "burn_after_read": false,
    "password_protected": false
  }'
```

删除阅后即焚内容：

```sh
curl -X DELETE http://127.0.0.1:8787/api/notes/demo1234
```

## Cloudflare 配置

远程 D1 数据库配置在 `wrangler.jsonc` 中：

```jsonc
{
  "binding": "DB",
  "database_name": "notes",
  "database_id": "40d957ea-58ee-4673-98cc-677efa4ebbc9"
}
```

如果重新创建数据库，需要把新的 `database_id` 写回 `wrangler.jsonc`，再运行远程迁移和部署命令。
