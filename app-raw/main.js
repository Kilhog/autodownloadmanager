var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var dialog = require('dialog');
var globalShortcut = require('global-shortcut');

app.commandLine.appendSwitch('--enable-viewport-meta', 'true');

// Report crashes to our server.
require('crash-reporter').start();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({"show": false, "min-width": 750, width: 800, "min-height": 400, height: 800, frame: false, center: true, resizable: true, title: "AutoDownloadManager"});
  //mainWindow.openDevTools();

  // Show the window when angular is ready
  ipc.on('dom-ready', function() {
    mainWindow.show();
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  ipc.on('minimize-window', function(event) {
    mainWindow.minimize();
  });

  ipc.on('button-close-window', function(event) {
    mainWindow.close();
  });

  ipc.on('hide-window', function(event) {
    mainWindow.hide();
  });

  // Event for the folder selection
  ipc.on('dialog-selection-dossier', function(event, arg){
    var res = dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ], title: 'Choisir un dossier pour les sous-titres'});
    event.sender.send('dialog-selection-dossier-reply', res);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  globalShortcut.register('ctrl+w', function() {
    mainWindow.close();
  });

  app.on('will-quit', function() {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
  });

});
