import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
  runtime: 'nodejs18.x'
};
 
export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}