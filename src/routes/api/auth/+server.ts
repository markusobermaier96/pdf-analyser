import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { signed } = await request.json();
  console.log(signed);
  return new Response();
};
