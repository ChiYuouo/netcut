# netcut

Hono + Cloudflare Workers + D1 backend for an encrypted network clipboard.

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

The API will be available at `http://127.0.0.1:8787`.

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
