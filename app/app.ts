import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { onModels, onModel, onPrompt, onReset } from './server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.whenReady().then(() => {
  ipcMain.on('models', onModels);
  ipcMain.on('model', onModel);
  ipcMain.on('prompt', onPrompt);
  ipcMain.on('reset', onReset);
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'api.js'),
    },
  });
  win.removeMenu();
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  // @ts-ignore
  if (__DEV__) {
    win.loadURL('http://localhost:8080/');
    win.webContents.openDevTools();
  } else {
    win.loadFile('index.html');
  }
});

app.on('window-all-closed', () => app.quit());
