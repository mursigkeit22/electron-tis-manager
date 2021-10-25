const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const fs = require('fs-extra')
const constants = require('./js_code/constants_js')
const myArray = ["empty"]

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // create necessary directories

  fs.ensureDirSync(constants.PATHS.tisPath)
  fs.ensureDirSync(constants.PATHS.completePath)
  fs.ensureDirSync(constants.PATHS.logPath)
  fs.emptyDirSync(constants.PATHS.utilsPath)

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [myArray.toString(), ]


    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(`${__dirname}/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  }



ipcMain.on('synchronous-message', (event, title, message) => {
  console.log(title, message)
  const { dialog } = require('electron')
  dialog.showMessageBox({ message: message, title: title })
  event.returnValue = null
})
ipcMain.on('load-page', (event, arg) => {
  mainWindow.loadURL(`${__dirname}${arg}`)
})

ipcMain.on('dialog_window', (event) => {
  const child = new BrowserWindow({
    width: 400,
    height: 200,
    parent: mainWindow,
    modal: true,
    show: false,
    icon: `${__dirname}/icons/white.png`,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })


  // child.setMenu(null)
  child.setMinimizable(false)
  child.loadFile(`${__dirname}/dialog.html`)
  child.once('ready-to-show', () => {
    child.show()
    event.returnValue = null
  })
})


ipcMain.on('choose_color_window', (event) => {
  const child = new BrowserWindow({
    width: 515,
    height: 400,
    parent: mainWindow,
    modal: true,
    show: false,
    titleBarStyle: 'hidden',
    transparent: true,
    icon: `${__dirname}/icons/white.png`,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  child.loadFile(`${__dirname}/choose_color.html`)

  child.once('ready-to-show', () => {
    child.show()
    child.on("closed", function () {event.returnValue = "hop"})

  })

})

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
