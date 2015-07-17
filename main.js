var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var dialog = require('dialog');

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
  mainWindow.openDevTools();

  ipc.on('dom-ready', function() {
    mainWindow.show();
  });

  // and load the index.html of the app.
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

    ipc.on('dialog-selection-dossier', function(event, arg){
        var res = dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ], title: 'Choisir un dossier pour les sous-titres'});
        event.sender.send('dialog-selection-dossier-reply', res);
    });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
