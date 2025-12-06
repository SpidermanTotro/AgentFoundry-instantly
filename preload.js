const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // App info
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Events from main process
  on: (channel, callback) => {
    const validChannels = [
      'open-project',
      'export-skills',
      'import-skills',
      'save-file',
      'analyze-code',
      'get-suggestions',
      'refactor-code',
      'toggle-learning',
      'show-skills'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Send events to main process
  send: (channel, data) => {
    const validChannels = ['skill-export-complete', 'skill-import-complete'];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  }
});

// Expose API for application
contextBridge.exposeInMainWorld('copilotAPI', {
  isElectron: true,
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});
