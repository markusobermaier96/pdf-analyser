import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, setHeaders }) => {
  setHeaders({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const sleep = (maxMs: number) => new Promise(resolve => setTimeout(resolve, Math.random() * maxMs));

  async function sendData(controller: ReadableStreamDefaultController, data: string) {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  };

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 40; i++) {
        sendData(controller, "You are dumb and i cant help you. ");
        await sleep(300);
      }
      sendData(controller, "[DONE]");
    }
  });

  return new Response(stream);

};
