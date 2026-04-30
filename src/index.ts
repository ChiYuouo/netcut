import { Hono } from 'hono';
import { cors } from 'hono/cors';

type SaveNoteBody = {
  id?: unknown;
  ciphertext?: unknown;
  iv?: unknown;
  ttl_seconds?: unknown;
  permission?: unknown;
  burn_after_read?: unknown;
  password_protected?: unknown;
};

type NoteRow = {
  id: string;
  content: string;
  iv: string;
  permission: 'readonly' | 'editable';
  burn_after_read: number;
  password_protected: number;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  }),
);

app.get('/api/health', (c) => c.json({ success: true }));

app.post('/api/notes', async (c) => {
  let body: SaveNoteBody;

  try {
    body = await c.req.json<SaveNoteBody>();
  } catch {
    return c.json({ success: false, message: '请求体必须是 JSON' }, 400);
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 必须是 1-64 位字母、数字、下划线或短横线' }, 400);
  }

  return writeNote(c.env.DB, id, body, false);
});

app.put('/api/notes/:id', async (c) => {
  const id = c.req.param('id');
  let body: SaveNoteBody;

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 格式不正确' }, 400);
  }

  try {
    body = await c.req.json<SaveNoteBody>();
  } catch {
    return c.json({ success: false, message: '请求体必须是 JSON' }, 400);
  }

  return writeNote(c.env.DB, id, body, true);
});

app.get('/api/notes/:id', async (c) => {
  const id = c.req.param('id');

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 格式不正确' }, 400);
  }

  const note = await c.env.DB.prepare(
    `SELECT id, content, iv, permission, burn_after_read, password_protected, created_at, updated_at, expires_at
     FROM notes
     WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
  )
    .bind(id)
    .first<NoteRow>();

  if (!note) {
    return c.json({ success: false, message: '文本不存在或已过期' }, 404);
  }

  return c.json(toNoteResponse(note));
});

app.delete('/api/notes/:id', async (c) => {
  const id = c.req.param('id');

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 格式不正确' }, 400);
  }

  await c.env.DB.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();
  return c.json({ success: true, id });
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env, ctx);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    return env.ASSETS.fetch(new Request(new URL('/', request.url), request));
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    await env.DB.prepare('DELETE FROM notes WHERE expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP').run();
  },
};

async function writeNote(db: D1Database, id: string, body: SaveNoteBody, upsert: boolean): Promise<Response> {
  const ciphertext = typeof body.ciphertext === 'string' ? body.ciphertext.trim() : '';
  const iv = typeof body.iv === 'string' ? body.iv.trim() : '';
  const ttlSeconds = normalizeTtl(body.ttl_seconds);
  const permission = normalizePermission(body.permission);
  const burnAfterRead = body.burn_after_read === true;
  const passwordProtected = body.password_protected === true;

  if (!isBase64Url(ciphertext)) {
    return json({ success: false, message: 'ciphertext 必须是 base64url 字符串' }, 400);
  }

  if (!isBase64Url(iv)) {
    return json({ success: false, message: 'iv 必须是 base64url 字符串' }, 400);
  }

  if (ttlSeconds === false) {
    return json({ success: false, message: 'ttl_seconds 必须是正整数或 null' }, 400);
  }

  if (!permission) {
    return json({ success: false, message: 'permission 必须是 readonly 或 editable' }, 400);
  }

  const expiresAt = ttlSeconds === null ? null : toSqliteTimestamp(new Date(Date.now() + ttlSeconds * 1000));

  try {
    if (upsert) {
      await db
        .prepare(
          `INSERT INTO notes (id, content, iv, permission, burn_after_read, password_protected, expires_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(id) DO UPDATE SET
             content = excluded.content,
             iv = excluded.iv,
             permission = excluded.permission,
             burn_after_read = excluded.burn_after_read,
             password_protected = excluded.password_protected,
             expires_at = excluded.expires_at,
             updated_at = CURRENT_TIMESTAMP`,
        )
        .bind(id, ciphertext, iv, permission, burnAfterRead ? 1 : 0, passwordProtected ? 1 : 0, expiresAt)
        .run();
    } else {
      await db
        .prepare(
          `INSERT INTO notes (id, content, iv, permission, burn_after_read, password_protected, expires_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        )
        .bind(id, ciphertext, iv, permission, burnAfterRead ? 1 : 0, passwordProtected ? 1 : 0, expiresAt)
        .run();
    }
  } catch (error) {
    if (isD1ConstraintError(error)) {
      return json({ success: false, message: 'id 已存在，请换一个短链接' }, 409);
    }

    console.error('Failed to save note', error);
    return json({ success: false, message: '保存失败' }, 500);
  }

  const note = await db
    .prepare(
      `SELECT id, content, iv, permission, burn_after_read, password_protected, created_at, updated_at, expires_at
       FROM notes
       WHERE id = ?`,
    )
    .bind(id)
    .first<NoteRow>();

  if (!note) {
    return json({ success: false, message: '保存后读取失败' }, 500);
  }

  return json(toNoteResponse(note));
}

function toNoteResponse(note: NoteRow) {
  return {
    success: true,
    id: note.id,
    ciphertext: note.content,
    iv: note.iv,
    permission: note.permission,
    burn_after_read: Boolean(note.burn_after_read),
    password_protected: Boolean(note.password_protected),
    created_at: note.created_at,
    updated_at: note.updated_at,
    expires_at: note.expires_at,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  });
}

function normalizeTtl(value: unknown): number | null | false {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return false;
  }

  return value;
}

function normalizePermission(value: unknown): 'readonly' | 'editable' | null {
  if (value === undefined || value === null || value === '') return 'readonly';
  return value === 'readonly' || value === 'editable' ? value : null;
}

function isValidNoteId(id: string): boolean {
  return /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

function isBase64Url(value: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(value);
}

function toSqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function isD1ConstraintError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('unique');
}
