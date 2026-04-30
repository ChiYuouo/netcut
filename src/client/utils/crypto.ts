export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  key: string;
};

const AES_PARAMS = { name: 'AES-GCM', length: 256 } as const;

export async function encryptText(plainText: string): Promise<EncryptedPayload> {
  const key = await crypto.subtle.generateKey(AES_PARAMS, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const rawKey = await crypto.subtle.exportKey('raw', key);

  return {
    ciphertext: toBase64Url(ciphertext),
    iv: toBase64Url(iv),
    key: toBase64Url(rawKey),
  };
}

export async function encryptTextWithPassword(plainText: string, password: string): Promise<EncryptedPayload> {
  const key = await deriveKeyFromPassword(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  return {
    ciphertext: toBase64Url(ciphertext),
    iv: toBase64Url(iv),
    key: '',
  };
}

export async function decryptText(ciphertext: string, iv: string, keyText: string): Promise<string> {
  const key = await importAesKey(keyText);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(iv) },
    key,
    fromBase64Url(ciphertext),
  );

  return new TextDecoder().decode(decrypted);
}

export async function decryptTextWithPassword(ciphertext: string, iv: string, password: string): Promise<string> {
  const key = await deriveKeyFromPassword(password);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(iv) },
    key,
    fromBase64Url(ciphertext),
  );

  return new TextDecoder().decode(decrypted);
}

export function workspaceSecret(noteId: string, password?: string): string {
  return password ? `${noteId}\n${password}` : noteId;
}

export async function importAesKey(keyText: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', fromBase64Url(keyText.trim()), AES_PARAMS, false, [
    'encrypt',
    'decrypt',
  ]);
}

export function createNoteId(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(16))).slice(0, 22);
}

export function parseHashKey(hash = window.location.hash): string | null {
  const hashText = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(hashText);
  return params.get('key');
}

export function buildShareUrl(noteId: string, key: string): string {
  const url = new URL(window.location.href);
  url.pathname = `/${noteId}`;
  url.search = '';
  url.hash = key ? `key=${encodeURIComponent(key)}` : '';
  return url.toString();
}

export function readNoteIdFromLocation(): string | null {
  const pathMatch = window.location.pathname.match(/^\/([A-Za-z0-9_-]{1,64})\/?$/);
  if (pathMatch) return pathMatch[1];

  const queryId = new URLSearchParams(window.location.search).get('note');
  return queryId && /^[A-Za-z0-9_-]{1,64}$/.test(queryId) ? queryId : null;
}

function toBase64Url(value: ArrayBuffer | Uint8Array): string {
  const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : value;
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function deriveKeyFromPassword(password: string): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: 180000,
      salt: new TextEncoder().encode(`netcut:workspace:v1:${password}`),
    },
    passwordKey,
    AES_PARAMS,
    false,
    ['encrypt', 'decrypt'],
  );
}

function fromBase64Url(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer.slice(0);
}
