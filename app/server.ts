import { ChildProcess, fork } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { app, IpcMainEvent } from 'electron';
import easydl from 'easydl';
import { Action, Request } from './worker.types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsPath = path.join(app.getPath('documents'), 'chato');
const defaultModelsPath = path.join(__dirname, 'models.json');
const userModelsPath = path.join(modelsPath, 'models.json');
const workerPath = path.join(__dirname, 'worker.js');

if (!fs.existsSync(modelsPath)) {
  fs.mkdirSync(modelsPath, { recursive: true });
}

let models: { id: string; url: string; }[];
try {
  if (!fs.existsSync(userModelsPath)) {
    fs.copyFileSync(defaultModelsPath, userModelsPath);
  }
  models = JSON.parse(fs.readFileSync(userModelsPath, 'utf-8'));
} catch (e) {
  models = JSON.parse(fs.readFileSync(defaultModelsPath, 'utf-8'));
}

let loader: AbortController | undefined;
let model: {
  id: string;
  controller: AbortController;
  listeners: Map<number, (res: any) => boolean | void>;
  reqId: number;
  worker: ChildProcess;
} | undefined;

const request = (req: Request, cb: (res: any) => boolean | void) => {
  if (!model) {
    throw new Error('Model not loaded');
  }
  const reqId = model.reqId++;
  const { listeners, worker } = model;
  listeners.set(reqId, cb);
  worker.send({ id: reqId, ...req });
};

export const onModels = ({ sender }: IpcMainEvent) => (
  sender.send('models', models.map(({ id }) => id))
);

export const onModel = async ({ sender }: IpcMainEvent, id: string, gpuLayers: number = 0) => {
  if (loader) {
    loader.abort();
    loader = undefined;
  }
  const metadata = models.find((m) => m.id === id); 
  if (!metadata) {
    return;
  }
  if (model) {
    model.controller.abort();
    model = undefined;
  }

  const controller = loader = new AbortController();
  const modelPath = path.join(modelsPath, `${metadata.id}.gguf`);
  const exists = fs.existsSync(modelPath);
  sender.send('model', id, true, exists ? 100 : 0);
  try {
    if (!exists) {
      let error: Error | undefined;
      await new easydl(metadata.url, modelPath, { connections: 1, httpOptions: { signal: controller.signal } })
        .on('error', (e) => {
          error = e;
        })
        .on('progress', ({ total }) => (
          sender.send('model', id, true, total.percentage)
        ))
        .wait();
      if (error) {
        throw error;
      }
    }
    model = await new Promise((resolve, reject) => {
      if (controller.signal.aborted) {
        reject({ name: 'AbortError' });
        return;
      }
      const listeners = new Map<number, (res: any) => boolean | void>();
      const worker = fork(workerPath, [modelPath, gpuLayers.toString()], { signal: controller.signal });
      worker.on('error', () => {});
      worker.once('message', (err) => {
        if (err !== null) {
          reject(err);
          return;
        }
        worker.on('message', ([id, ...res]: any) => {
          const listener = listeners.get(id);
          if (listener) {
            const done = !listener(res);
            if (done) {
              listeners.delete(id);
            }
          }
        });
        resolve({
          id,
          controller,
          listeners,
          reqId: 1,
          worker,
        });
      });
    });
  } catch (e) {
    if ((e as Error).name === 'AbortError') {
      return;
    }
  }
  loader = undefined;
  sender.send('model', model ? id : '', false, model ? 100 : 0);
};

export const onPrompt = async ({ sender }: IpcMainEvent, text: string) => {
  if (!model) {
    throw new Error('Model not loaded');
  }
  request({ action: Action.prompt, text }, ([text, done, aborted]: [string, boolean, boolean]) => {
    if (aborted) {
      return;
    }
    if (done) {
      sender.send('response', '', true);
      return;
    }
    sender.send('response', text);
    return true;
  });
};

export const onReset = async ({ sender }: IpcMainEvent) => {
  if (!model) {
    throw new Error('Model not loaded');
  }
  const { id } = model;
  request({ action: Action.reset }, () => sender.send('model', id));
};

export const onUnload = async ({ sender }: IpcMainEvent) => {
  if (loader) {
    loader.abort();
    loader = undefined;
  }
  if (model) {
    model.controller.abort();
    model = undefined;
  }
  sender.send('model', '', false, 0);
};
