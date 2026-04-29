# netcut

Hono + Cloudflare Workers + D1 network clipboard with browser-side encryption.

Open the deployed Worker URL to use the web page directly:

```txt
https://netcut.zyc630089289.workers.dev
```

Enter a text key to open a private note. The same key opens the same saved text, and different keys open different text spaces.

## Local development

Install dependencies:

```sh
npm install
```

Apply the local D1 migration:

```sh
npm run db:migrate:local
```

Start the Worker locally:

```sh
npm run dev
```

The page and API will be available at `http://127.0.0.1:8787`.

## API

Create a note:

```sh
curl -X POST http://127.0.0.1:8787/api/notes \
  -H "Content-Type: application/json" \
  -d '{"id":"demo1234","content":"encrypted-payload","ttl_seconds":3600}'
```

Read a note:

```sh
curl http://127.0.0.1:8787/api/notes/demo1234
```

Overwrite a note:

```sh
curl -X PUT http://127.0.0.1:8787/api/notes/demo1234 \
  -H "Content-Type: application/json" \
  -d '{"content":"encrypted-payload"}'
```

## Cloudflare D1 setup

Create the remote D1 database:

```sh
npx wrangler d1 create netcut-db
```

Copy the generated `database_id` into `wrangler.jsonc`, then apply the remote migration:

```sh
npm run db:migrate:remote
```

Deploy:

```sh
npm run deploy
```

Expired notes are hidden at read time and physically cleaned by the configured daily Cron Trigger.
