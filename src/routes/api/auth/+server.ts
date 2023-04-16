import type { RequestHandler } from '@sveltejs/kit';
// TODO: finish user authentication
export const POST: RequestHandler = async ({ request }) => {
  const { signed, address } = await request.json();
  console.log(address)
  console.log(signed)
  return new Response();
};
