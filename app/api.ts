import { contextBridge, ipcRenderer } from 'electron';

const API = {
  onModels: (cb: (models: string[]) => void) => (
    ipcRenderer.on('models', (_event, models) => cb(models))
  ),
  onModel: (cb: (id: string, loading: boolean, progress: number) => void) => (
    ipcRenderer.on('model', (_event, id, loading = false, progress = 100) => cb(id, loading, progress))
  ),
  onResponse: (cb: (done: boolean, text: string) => void) => (
    ipcRenderer.on('response', (_event, done, text) => cb(done, text))
  ),
  models: () => (
    ipcRenderer.send('models')
  ),
  model: (id: string, gpuLayers: number = 0) => (
    ipcRenderer.send('model', id, gpuLayers)
  ),
  prompt: (text: string) => (
    ipcRenderer.send('prompt', text)
  ),
  reset: () => (
    ipcRenderer.send('reset')
  ),
};

contextBridge.exposeInMainWorld('API', API);

export type API = typeof API;