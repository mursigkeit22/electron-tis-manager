const fs = require('fs')
const constants = require('./constants_js')

const { ipcRenderer: ipc } = require('electron')
window.addEventListener('error', function (e) {
  // записываем в файл, т.к. ни один способ передачи данных
  // из renderer process в main process и потом обратно у меня не сработал
  fs.writeFileSync(`${constants.PATHS.utilsPath}dialog_data.txt`,
    'error??JavaScript error occurred??' + e.error.message)

  ipc.sendSync('dialog_window')
})
