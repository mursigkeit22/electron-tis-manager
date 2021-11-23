const { PythonShell } = require('python-shell')
const ipc = require('electron').ipcRenderer
const utils = require('./utils')
const path = require('path')
const fs = require('fs')
const constants = require('./constants_js')
let task

const options = {
  pythonPath: path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '../Python38/python.exe'),
  args: []
}

const Go = document.getElementById('go')
Go.addEventListener('click', () => {
  if (!utils.checkIfFilesAdded()) { return }
  if (typeof task === 'undefined') { return }
  options.args.push(task)
  utils.logToFile('OPTIONS:' + options)
  PythonShell.run(path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '../python_code/entry_python_point.py'), options, (err, results) => {
    utils.logToFile(`options: ${options.args}`)
    console.log(`PYTHONSHELLRUN OPTIONS.ARGS: ${options.args}`)
    if (err) {
      utils.logToFile(`PYTHONSHELLRUN ERROR: ${err}`)
      window.alert(err)
    }
    console.log(results)
    console.log(`RESULT: ${results}`)
    ipc.send('load-page', '/done.html')
  })
  document.getElementById('leftbox').style.display = 'none'
  document.getElementById('inputLabel').style.display = 'none'
  document.getElementById('nameList').style.display = 'none'
  document.getElementById('format_info').style.display = 'none'

  document.getElementById('go').style.display = 'none'
  document.body.style.cursor = 'wait'
  document.getElementById('wait').style.display = 'inline'
})

const buttons = document.getElementsByClassName('btn-mine')

for (const bn of buttons) {
  const buttonId = bn.id
  bn.addEventListener('click', async function () {
    if ((buttonId === '3' || buttonId === '4') && (!this.classList.contains('active'))) { // если кнопка уже активна, то надо сделать её неактивной, не надо снова выбирать цвета
      ipc.sendSync('choose_color_window')
      if (!fs.existsSync(`${constants.PATHS.utilsPath}${constants.PATHS.colorsFile}`)) { // если не выбрали ни одного цвета, то не делаем кнопку активной
        console.log('not exist, breaking')
        return
      }
    }
    console.log('after if window')
    if (!this.classList.contains('active')) {
      if (task !== undefined) {
        document.getElementById(task).classList.remove('active')
      }
      this.classList.add('active')
      task = buttonId
      console.log('Adding Active')
    } else {
      task = undefined
      this.classList.remove('active')
    }
  })
}
