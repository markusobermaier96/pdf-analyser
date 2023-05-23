import { createHash } from "crypto";

export function generateHash(data: string | Buffer): Promise<string> {
  const hash = createHash("sha256");
  hash.update(data);
  return Promise.resolve(hash.digest("hex"));
}

export async function generateHashMaxLength(
  data: string | Buffer,
  MAX_HASH_LENGTH: number
): Promise<string> {
  const hash = await generateHash(data);
  return hash.substring(0, MAX_HASH_LENGTH);
}
