/**
 * GenSpark 2.0 - Electron Main Process
 * Complete offline AI platform with all features
 */

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// Server configuration
const SERVER_PORT = 3000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    backgroundColor: '#1e1e1e',
    title: 'GenSpark 2.0 - Complete Offline AI Platform'
  });

  // Load app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Window events
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu-new-project')
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile', 'openDirectory']
            });
            if (!result.canceled) {
              mainWindow.webContents.send('menu-open', result.filePaths[0]);
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-save')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Workspace',
      submenu: [
        {
          label: 'AI Slides',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('open-slides')
        },
        {
          label: 'AI Docs',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('open-docs')
        },
        {
          label: 'AI Sheets',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('open-sheets')
        },
        {
          label: 'AI Designer',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow.webContents.send('open-designer')
        }
      ]
    },
    {
      label: 'Media',
      submenu: [
        {
          label: 'Generate Image',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => mainWindow.webContents.send('generate-image')
        },
        {
          label: 'Generate Video',
          accelerator: 'CmdOrCtrl+Shift+V',
          click: () => mainWindow.webContents.send('generate-video')
        },
        {
          label: 'Generate Audio',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => mainWindow.webContents.send('generate-audio')
        },
        {
          label: 'Create GIF',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => mainWindow.webContents.send('create-gif')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => mainWindow.webContents.send('open-docs-page')
        },
        {
          label: 'About GenSpark 2.0',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About GenSpark 2.0',
              message: 'GenSpark 2.0',
              detail: 'Complete Offline AI Platform\nVersion 2.0.0\n\n100% FREE & Open Source\n\nFeatures:\n• AI Workspace Suite\n• Image/Video/Audio/GIF Generation\n• Code Completion\n• Document Processing\n• And Much More!'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startServer() {
  console.log('Starting GenSpark 2.0 server...');
  
  serverProcess = spawn('node', [path.join(__dirname, '../src/server.js')], {
    env: { ...process.env, PORT: SERVER_PORT }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
}

function stopServer() {
  if (serverProcess) {
    console.log('Stopping server...');
    serverProcess.kill();
    serverProcess = null;
  }
}

// App lifecycle
app.whenReady().then(() => {
  startServer();
  
  // Wait for server to start
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopServer();
});

// IPC handlers
ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  return await dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow, options);
});

console.log('GenSpark 2.0 Electron - Ready');
