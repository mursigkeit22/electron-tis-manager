const { PythonShell } = require('python-shell')
const utils = require('./utils')
const path = require('path')
const {arrayFiles} = require("./upload_file_functions");
let task = undefined;



const options = {
  pythonPath: path.join(__dirname, '../Python38/python.exe'),
  args: []
}

const Go = document.getElementById('go')
Go.addEventListener('click', () => {


  if (!utils.checkIfFilesAdded()) {return}
  options.args.push(task)
  utils.logToFile('OPTIONS:' + options)
  PythonShell.run(path.join(__dirname, '../python_code/entry_python_point.py'), options, (err, results) => {
    utils.logToFile(`options: ${options.args}`)
    utils.logToElectron(`PYTHONSHELLRUN OPTIONS.ARGS: ${options.args}`) //TODO: check when and why options are empty
    if (err) {
      utils.logToElectron(`PYTHONSHELLRUN ERROR: ${err}`)
      alert(err)
      utils.logToElectron(`PYTHONSHELLRUN ERROR: ${err}`)
    }
    utils.logToElectron(results)
    utils.logToElectron(`RESULT: ${results}`)
    ipc.send('load-page', '/done.html')
  })
  document.getElementById('leftbox').style.display = 'none'
  document.getElementById('inputLabel').style.display = 'none'
  document.getElementById('rightbox').style.display = 'none'
  document.getElementById('nameList').style.display = 'none'

  document.getElementById('go').style.display = 'none'
  document.body.style.cursor = 'wait'
  document.getElementById('wait').style.display = 'inline'
})


const buttons = document.getElementsByClassName("btn-mine")
for (let bn of buttons) {
  const button_id = bn.id
  const spanId = bn.firstElementChild.id
  document.getElementById(button_id).addEventListener('click', () => {

    if (bn.firstElementChild.style.getPropertyValue("display")==='none') {
      console.log('TASK if none before '+task)

      if (task !== undefined){
        document.getElementById(task).firstElementChild.style.display = "none"

      }
      task = button_id
      document.getElementById(spanId).style.display = "flex"
      console.log('TASK if none after '+task)
    }
    else {
      task = undefined
      document.getElementById(spanId).style.display = "none"
    }
  })
}

// TODO: всплывающие окна https://getbootstrap.com/docs/5.1/components/modal/
