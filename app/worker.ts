import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import { Action, Request } from './worker.types';

let model: LlamaModel;
let context: LlamaContext;
let session: LlamaChatSession;
let current: AbortController | undefined;

try {
  model = new LlamaModel({ gpuLayers: parseInt(process.argv[3], 10), modelPath: process.argv[2] });
  context = new LlamaContext({ model });
  session = new LlamaChatSession({ context });
} catch (e) {
  process.send!((e as Error).message);
  process.exit(1);
}

process.on('message', async (req: Request & { id: number }) => {
  const { id, action } = req;
  switch (action) {
    case Action.prompt: {
      if (current) {
        current.abort();
      }
      const controller = current = new AbortController();
      try {
        await session.prompt(req.text, {
          onToken: (tokens) => (
            process.send!([id, context.decode(tokens)])
          ),
          signal: controller.signal,
        });
      } catch (e) {
        if ((e as Error).name === 'AbortError') {
          process.send!([id, '', false, true]);
          return;
        }
      }
      current = undefined;
      process.send!([id, '', true]);
      break;
    }
    case Action.reset:
      if (current) {
        current.abort();
      }
      context = new LlamaContext({ model });
      session = new LlamaChatSession({ context });
      process.send!([id]);
      break;
  }
});

process.send!(null);
