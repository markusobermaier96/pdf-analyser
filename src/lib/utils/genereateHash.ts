import { createHash } from 'crypto';

export function generateHash(data: string | Buffer): Promise<string> {
  const hash = createHash('sha256');
  hash.update(data);
  return Promise.resolve(hash.digest('hex'));
}
