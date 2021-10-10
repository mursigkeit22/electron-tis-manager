const { PythonShell } = require('python-shell')
const fs = require('fs-extra')
const constants = require('./constants_js')
const utils = require('./utils')
const path = require('path')
const {arrayFiles} = require("./upload_file_functions");
const ipc = require('electron').ipcRenderer

const options = {
  pythonPath: path.join(__dirname, '../Python38/python.exe'),
  args: []
}

const Go = document.getElementById('go')
Go.addEventListener('click', () => {
  for (const obj of arrayFiles) {
    fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, obj.name)
    fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, '\r\n')
    fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, obj.path)
    fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, '\r\n')

  }
  if (!fs.existsSync(`${constants.PATHS.utilsPath}options.args.txt`)) {
    utils.logToFile("File options.args.txt doesn't exist")
    return
  }

  const textOpt = fs.readFileSync(`${constants.PATHS.utilsPath}options.args.txt`, 'utf8')
  if (textOpt.length === 0) { return }
  utils.logToElectron(`TEXT_OPT: ${textOpt}`)
  const textByLine = textOpt.split('?')
  for (const str of textByLine) {
    options.args.push(str)
  }

  PythonShell.run(path.join(__dirname, '../python_code/entry_python_point.py'), options, (err, results) => {
    utils.logToElectron(`options: ${options.args}`)
    utils.logToElectron(`PYTHONSHELLRUN OPTIONS.ARGS: ${options.args}`)
    if (err) {
      utils.logToElectron(`PYTHONSHELLRUN ERROR: ${err}`)
      alert(err)
      utils.logToElectron(`PYTHONSHELLRUN ERROR: ${err}`)
    }
    utils.logToElectron(results)
    utils.logToElectron(`RESULT: ${results}`)
    ipc.send('load-page', '/job_done.html')
  })
  document.getElementById('leftbox').style.display = 'none'
  document.getElementById('inputLabel').style.display = 'none'
  document.getElementById('rightbox').style.display = 'none'
  document.getElementById('nameList').style.display = 'none'

  document.getElementById('go').style.display = 'none'
  document.body.style.cursor = 'wait'
  document.getElementById('wait').style.display = 'inline'
})

// TODO: цифры на кнопках - https://getbootstrap.com/docs/5.1/components/badge/
// TODO: всплывающие окна https://getbootstrap.com/docs/5.1/components/modal/