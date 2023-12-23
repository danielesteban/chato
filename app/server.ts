import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { app, IpcMainEvent } from 'electron';
import easydl from 'easydl';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsPath = path.join(app.getPath('documents'), 'chato');
if (!fs.existsSync(modelsPath)) {
  fs.mkdirSync(modelsPath, { recursive: true });
}

const defaultModelsPath = path.join(__dirname, 'models.json');
const userModelsPath = path.join(modelsPath, 'models.json');
let models: { id: string; filename: string; download: string; }[];
try {
  if (!fs.existsSync(userModelsPath)) {
    fs.copyFileSync(defaultModelsPath, userModelsPath);
  }
  models = JSON.parse(fs.readFileSync(userModelsPath, 'utf-8'));
} catch (e) {
  models = JSON.parse(fs.readFileSync(defaultModelsPath, 'utf-8'));
}

let chat: {
  id: string,
  model: LlamaModel,
  context: LlamaContext,
  session: LlamaChatSession,
  current?: AbortController,
} | undefined;

export const onModels = ({ sender }: IpcMainEvent) => (
  sender.send('models', models.map(({ id }) => id))
);

export const onModel = async ({ sender }: IpcMainEvent, id: string, gpuLayers: number = 0) => {
  if (chat?.id === id) {
    sender.send('model', id, false, 100);
    return;
  }
  const metadata = models.find((m) => m.id === id); 
  if (!metadata) {
    return;
  }
  if (chat?.current) {
    chat.current.abort();
  }
  chat = undefined;
  const modelPath = path.join(modelsPath, metadata.filename);
  const exists = fs.existsSync(modelPath);
  sender.send('model', id, true, exists ? 100 : 0);
  try {
    if (!exists) {
      await new easydl(metadata.download, modelPath, { connections: 1 })
        .on('progress', ({ total }) => (
          sender.send('model', id, true, total.percentage)
        ))
        .wait();
    }
    const model = new LlamaModel({
      gpuLayers,
      modelPath: path.join(modelsPath, metadata.filename),
    });
    const context = new LlamaContext({ model });
    const session = new LlamaChatSession({ context });
    chat = { id, model, context, session };
  } catch (e) {}
  sender.send('model', chat ? id : '', false, chat ? 100 : 0);
};

export const onPrompt = async ({ sender }: IpcMainEvent, text: string) => {
  if (!chat) {
    return;
  }
  const { context, session } = chat;
  let { current } = chat;
  if (current) {
    current.abort();
  }
  chat.current = current = new AbortController();
  try {
    await session.prompt(text, {
      onToken: (tokens) => (
        sender.send('response', false, context.decode(tokens))
      ),
      signal: current.signal,
    });
  } catch (e) {
    if ((e as Error).name === 'AbortError') {
      return;
    }
  }
  chat.current = undefined;
  sender.send('response', true);
};
