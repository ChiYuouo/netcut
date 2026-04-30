import type { Permission } from './store/noteStore';

export type NoteResponse = {
  success: boolean;
  message?: string;
  id: string;
  ciphertext: string;
  iv: string;
  permission: Permission;
  burn_after_read: boolean;
  password_protected: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
};

export type SaveNoteRequest = {
  ciphertext: string;
  iv: string;
  ttl_seconds: number | null;
  permission: Permission;
  burn_after_read: boolean;
  password_protected: boolean;
};

export async function fetchNote(id: string): Promise<NoteResponse> {
  const response = await fetch(`/api/notes/${encodeURIComponent(id)}`);
  const body = (await response.json()) as NoteResponse;

  if (!response.ok || !body.success) {
    throw new Error(`${response.status}: ${body.message || '读取失败'}`);
  }

  return body;
}

export async function saveNote(id: string, payload: SaveNoteRequest): Promise<NoteResponse> {
  const response = await fetch(`/api/notes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as NoteResponse;

  if (!response.ok || !body.success) {
    throw new Error(`${response.status}: ${body.message || '保存失败'}`);
  }

  return body;
}

export async function burnNote(id: string): Promise<void> {
  const response = await fetch(`/api/notes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const body = (await response.json()) as { success: boolean; message?: string };

  if (!response.ok || !body.success) {
    throw new Error(`${response.status}: ${body.message || '删除失败'}`);
  }
}
