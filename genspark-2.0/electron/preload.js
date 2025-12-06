/**
 * Electron Preload Script
 * Exposes safe IPC methods to renderer
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // App methods
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // Dialog methods
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // Menu events
  onMenuEvent: (channel, callback) => {
    const validChannels = [
      'menu-new-project',
      'menu-open',
      'menu-save',
      'open-slides',
      'open-docs',
      'open-sheets',
      'open-designer',
      'generate-image',
      'generate-video',
      'generate-audio',
      'create-gif'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});

console.log('GenSpark 2.0 Preload - Ready');
