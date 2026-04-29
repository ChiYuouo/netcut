import { Hono } from 'hono';
import { cors } from 'hono/cors';

type CreateNoteBody = {
  id?: unknown;
  content?: unknown;
  ttl_seconds?: unknown;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);

app.get('/api/health', (c) => c.json({ success: true }));

app.post('/api/notes', async (c) => {
  let body: CreateNoteBody;

  try {
    body = await c.req.json<CreateNoteBody>();
  } catch {
    return c.json({ success: false, message: '请求体必须是 JSON' }, 400);
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const content = typeof body.content === 'string' ? body.content : '';
  const ttlSeconds = normalizeTtl(body.ttl_seconds);

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 必须是 4-64 位字母、数字、下划线或短横线' }, 400);
  }

  if (!content) {
    return c.json({ success: false, message: 'content 不能为空' }, 400);
  }

  if (ttlSeconds === false) {
    return c.json({ success: false, message: 'ttl_seconds 必须是正整数' }, 400);
  }

  const expiresAt =
    ttlSeconds === null ? null : toSqliteTimestamp(new Date(Date.now() + ttlSeconds * 1000));

  try {
    await c.env.DB.prepare('INSERT INTO notes (id, content, expires_at) VALUES (?, ?, ?)')
      .bind(id, content, expiresAt)
      .run();
  } catch (error) {
    if (isD1ConstraintError(error)) {
      return c.json({ success: false, message: 'id 已存在，请换一个短链接' }, 409);
    }

    console.error('Failed to create note', error);
    return c.json({ success: false, message: '保存失败' }, 500);
  }

  return c.json({ success: true, id, expires_at: expiresAt });
});

app.get('/api/notes/:id', async (c) => {
  const id = c.req.param('id');

  if (!isValidNoteId(id)) {
    return c.json({ success: false, message: 'id 格式不正确' }, 400);
  }

  const note = await c.env.DB.prepare(
    `SELECT content
     FROM notes
     WHERE id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
  )
    .bind(id)
    .first<{ content: string }>();

  if (!note) {
    return c.json({ success: false, message: '文本不存在或已过期' }, 404);
  }

  return c.json({ success: true, content: note.content });
});

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext) {
    await env.DB.prepare('DELETE FROM notes WHERE expires_at IS NOT NULL AND expires_at <= CURRENT_TIMESTAMP').run();
  },
};

function normalizeTtl(value: unknown): number | null | false {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return false;
  }

  return value;
}

function isValidNoteId(id: string): boolean {
  return /^[A-Za-z0-9_-]{4,64}$/.test(id);
}

function toSqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function isD1ConstraintError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('unique');
}
