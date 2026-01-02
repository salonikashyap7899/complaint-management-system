const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let nextProcess;

function startNextServer() {
  return new Promise((resolve) => {
    const nextPath = path.join(__dirname, '../node_modules/.bin/next');
    const scriptPath = process.platform === 'win32' ? `${nextPath}.cmd` : nextPath;
    
    nextProcess = spawn('node', [path.join(__dirname, '../node_modules/next/dist/bin/next'), 'start'], {
      cwd: path.join(__dirname, '..'),
      env: { 
        ...process.env, 
        PORT: '3000',
        NODE_ENV: 'production'
      },
      stdio: 'inherit'
    });

    // Wait a bit for server to start
    setTimeout(() => {
      resolve();
    }, 5000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false, // Don't show until ready
  });

  const startUrl = 'http://localhost:3000';

  if (isDev) {
    // In development, assume Next.js dev server is already running
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.show();
  } else {
    // In production, start Next.js server first
    startNextServer().then(() => {
      mainWindow.loadURL(startUrl);
      mainWindow.show();
    }).catch((err) => {
      console.error('Failed to start Next.js server:', err);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (nextProcess) {
    nextProcess.kill('SIGTERM');
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill('SIGTERM');
  }
});
