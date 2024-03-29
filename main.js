const {app, BrowserWindow} = require('electron')
const fs = require('fs-extra');
const electron = require("electron");
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


function createWindow() {
    // Create the browser window.

    const directory = `${__dirname}/tempFiles`;
    const path = require('path');

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.remove(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });

    mainWindow = new BrowserWindow({width: 1200, height: 600,
        backgroundColor: '#2e2c29',
        })


    // and load the index.html of the app.
    mainWindow.loadFile(`${__dirname}/index.html`);
    const contextMenu = new Menu();
    contextMenu.append(new MenuItem({
        role:'paste'
    }));
    contextMenu.append(new MenuItem({
        role:'selectAll'        })
    );
    contextMenu.append(new MenuItem({
        role:'copy'        })
    );
    mainWindow.webContents.on("context-menu", function (event, params) {
        contextMenu.popup(mainWindow);
    });


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;

    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()

    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var logger = require('electron-log');
const { dialog } = require('electron')
