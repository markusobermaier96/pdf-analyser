import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
    });

    const delay = 2000; // 2 seconds

    const stream = new ReadableStream({
      start(controller) {
        let i = 0;
    
        const interval = setInterval(() => {
          i++;
          if (i > 10) {
            clearInterval(interval);
            controller.close();
            return;
          }
    
          controller.enqueue(new TextEncoder().encode(`event: my-event\n`));
          controller.enqueue(new TextEncoder().encode(`data: message: 'hiiii'\n\n`));
        }, delay);
      },
    });
    
    return new Response(stream);
    
};
