import {app, Menu, ipcMain, globalShortcut} from 'electron';
import {devMenuTemplate} from './back/helpers/dev_menu_template';
import {editMenuTemplate} from './back/helpers/edit_menu_template';
import createWindow from './back/helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;

var setApplicationMenu = function() {
  var menus = [editMenuTemplate];
  if(env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('ready', function() {
  setApplicationMenu();

  var mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    title: 'Auto Download Manager'
  });

  ipcMain.on('minimize-window', (event) => {
    mainWindow.minimize();
  });

  ipcMain.on('button-close-window', (event) => {
    mainWindow.close();
  });

  ipcMain.on('hide-window', (event) => {
    mainWindow.hide();
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  if(env.name !== 'production') {
    mainWindow.openDevTools();
  }
});

app.on('window-all-closed', function() {
  app.quit();
});

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
