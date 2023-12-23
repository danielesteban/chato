import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow, ipcMain } from 'electron';
import { onModels, onModel, onPrompt } from './server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.whenReady().then(() => {
  ipcMain.on('models', onModels);
  ipcMain.on('model', onModel);
  ipcMain.on('prompt', onPrompt);
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'api.js'),
    },
  });
  mainWindow.removeMenu();
  // @ts-ignore
  if (__DEV__) {
    mainWindow.loadURL('http://localhost:8080/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('index.html');
  }
});

app.on('window-all-closed', () => app.quit());
