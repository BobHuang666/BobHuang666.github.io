/**
 * 浏览器端 AES-GCM 解密工具。
 *
 * 设计目标：名片里的个人隐私信息（手机号 / 邮箱 / 地址等）以密文形式存放在
 * `src/data/businessCard.ts`，口令（密码）只存在于使用者脑中，既不会写进源码，
 * 也不会出现在构建产物里——只有输入正确口令才能解密出明文。
 *
 * 密文格式：`base64(salt).base64(iv).base64(ciphertext)`
 * 密钥由口令经 PBKDF2(SHA-256, 150000 次) 派生，AES-GCM 256。
 */

const PBKDF2_ITERATIONS = 150_000;
const CHECK_TOKEN = 'bobcard-v1';

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
}

export interface BusinessCardField {
  label: string;
  value: string;
  enLabel?: string;
  enValue?: string;
}

export interface BusinessCardData {
  fields: Record<string, BusinessCardField>;
  /** 校验令牌，解密后用于确认口令正确 */
  _check?: string;
}

/**
 * 用口令解密名片数据。口令错误会抛出异常（AES-GCM 认证失败），
 * 调用方据此提示「口令错误」。
 */
export async function decryptBusinessCard(
  payload: string,
  password: string,
): Promise<BusinessCardData> {
  const parts = payload.split('.');
  if (parts.length !== 3) throw new Error('密文格式不正确');

  const salt = base64ToBytes(parts[0]);
  const iv = base64ToBytes(parts[1]);
  const data = base64ToBytes(parts[2]);

  const key = await deriveKey(password, salt);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  const obj = JSON.parse(new TextDecoder().decode(plain)) as BusinessCardData;

  if (obj._check !== CHECK_TOKEN) throw new Error('校验失败');
  return obj;
}
