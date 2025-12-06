const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;
const isDev = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3001;
const FRONTEND_PORT = 3002;

// Auto-update configuration
const autoUpdater = require('electron-updater').autoUpdater;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, 'public/icon.png'),
    backgroundColor: '#0d1117',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    frame: true,
    show: false,
  });

  // Create custom menu
  createMenu();

  // Load the app
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Check for updates
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: openProject
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('save-file')
        },
        { type: 'separator' },
        {
          label: 'Export Skills',
          click: exportSkills
        },
        {
          label: 'Import Skills',
          click: importSkills
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
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
      label: 'AI',
      submenu: [
        {
          label: 'Analyze Code',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => mainWindow.webContents.send('analyze-code')
        },
        {
          label: 'Get Suggestions',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('get-suggestions')
        },
        {
          label: 'Refactor',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => mainWindow.webContents.send('refactor-code')
        },
        { type: 'separator' },
        {
          label: 'Toggle Learning',
          click: toggleLearning
        },
        {
          label: 'View Skills',
          click: () => mainWindow.webContents.send('show-skills')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => require('electron').shell.openExternal('https://github.com/SpidermanTotro/AgentFoundry-instantly')
        },
        {
          label: 'Report Issue',
          click: () => require('electron').shell.openExternal('https://github.com/SpidermanTotro/AgentFoundry-instantly/issues')
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => autoUpdater.checkForUpdates()
        },
        {
          label: 'About',
          click: showAbout
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startServer() {
  const serverPath = path.join(__dirname, 'server/index.js');
  
  serverProcess = spawn('node', [serverPath], {
    cwd: __dirname,
    env: { ...process.env, PORT }
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
    serverProcess.kill();
    serverProcess = null;
  }
}

async function openProject() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    mainWindow.webContents.send('open-project', result.filePaths[0]);
  }
}

async function exportSkills() {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Skills',
    defaultPath: 'copilot-skills.json',
    filters: [
      { name: 'JSON', extensions: ['json'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    mainWindow.webContents.send('export-skills', result.filePath);
  }
}

async function importSkills() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import Skills',
    filters: [
      { name: 'JSON', extensions: ['json'] }
    ],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    mainWindow.webContents.send('import-skills', result.filePaths[0]);
  }
}

function toggleLearning() {
  mainWindow.webContents.send('toggle-learning');
}

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About Copilot Pro',
    message: 'Advanced Offline AI Copilot Pro',
    detail: `Version: ${app.getVersion()}\n\nA professional-grade AI coding assistant that works completely offline.\n\n• 100% Offline AI\n• Self-Learning System\n• Multi-Language Support\n• Zero Restrictions\n\nBuilt with Electron, React, and advanced AI technologies.`,
    buttons: ['OK']
  });
}

// Auto-updater events
autoUpdater.on('update-available', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded in the background.',
    buttons: ['OK']
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'A new version has been downloaded. Restart to apply the update.',
    buttons: ['Restart', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// App lifecycle events
app.on('ready', () => {
  startServer();
  
  // Wait for server to start
  setTimeout(() => {
    createWindow();
  }, 2000);
});

app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopServer();
});

// IPC handlers
ipcMain.handle('get-app-path', () => app.getPath('userData'));
ipcMain.handle('get-version', () => app.getVersion());

module.exports = { app };
