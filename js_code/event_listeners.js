const { PythonShell } = require('python-shell')
const fs = require('fs-extra')
const constants = require('./constants_js')
const utils = require('./utils')
const uploadHelpers = require('./upload_file_functions')
const path = require('path')
const ipc = require('electron').ipcRenderer;

const options = {
  pythonPath: path.join(__dirname, '../Python38/python.exe'),
  args: []
}

const buttonFileCycle = document.getElementById('go')
buttonFileCycle.addEventListener('click', () => {

  if (!fs.existsSync(`${constants.PATHS.utilsPath}options.args.txt`)) {
    utils.logToFile("File options.args.txt doesn't exist")
    return
  }

  const textOpt = fs.readFileSync(`${constants.PATHS.utilsPath}options.args.txt`, 'utf8');
  if (textOpt.length === 0) {return}
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
    ipc.send('load-page', '/job_done.html');
  })
  console.log("waiting page")
  document.getElementById('g').style.display = 'none'
  document.getElementById('leftbox').style.display = 'none'
  document.getElementById('inputLabel').style.display = 'none'
  document.getElementById('rightbox').style.display = 'none'
  document.getElementById('nameList').style.display = 'none'

  document.getElementById('go').style.display = 'none'
  document.body.style.cursor = 'wait'
  document.getElementById('wait').style.display = 'inline'
  console.log("before loading")


})


//Todo: bootstrap alert https://getbootstrap.com/docs/5.1/components/alerts/
//TODO: цифры на кнопках - https://getbootstrap.com/docs/5.1/components/badge/
//TODO: всплывающие окна https://getbootstrap.com/docs/5.1/components/modal/
