const { PythonShell } = require('python-shell')
const utils = require('./utils')
const path = require('path')
const {arrayFiles} = require("./upload_file_functions");
const arrayTasks = []

console.log(arrayTasks)


const options = {
  pythonPath: path.join(__dirname, '../Python38/python.exe'),
  args: []
}

const Go = document.getElementById('go')
Go.addEventListener('click', () => {
  utils.logToFile("arrayTasks: "+arrayTasks)
  // for (const obj of arrayFiles) {
  //   fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, obj.name)
  //   fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, '\n')
  //   fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, obj.path)
  //   fs.appendFileSync(`${constants.PATHS.utilsPath}new_file.txt`, '\n')
  //
  // }


  // if (!fs.existsSync(`${constants.PATHS.utilsPath}options.args.txt`)) {
  //   utils.logToFile("File options.args.txt doesn't exist")
  //   return
  // }
  // let textOpt = fs.readFileSync(`${constants.PATHS.utilsPath}options.args.txt`, 'utf8')
  // if (textOpt.length === 0) { return }
  // utils.logToElectron(`TEXT_OPT: ${textOpt}`)
  // const textByLine = textOpt.split('?')
  // for (const str of textByLine) {
  //   options.args.push(str)
  // }

  if (!utils.checkIfFilesAdded()) {return}
  options.args.push(arrayTasks)

  PythonShell.run(path.join(__dirname, '../python_code/entry_python_point.py'), options, (err, results) => {
    utils.logToFile(`options: ${options.args}`)
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

const buttons = document.getElementsByClassName("btn-mine")
for (let bn of buttons) {
  const button_id = bn.id
  const spanId = bn.firstElementChild.id
  document.getElementById(button_id).addEventListener('click', () => {

    if (bn.firstElementChild.style.getPropertyValue("display")==='none') {
      arrayTasks.push(button_id)
      document.getElementById(spanId).style.display = "flex"
    }
    else {
      const index = arrayTasks.indexOf(button_id);
      if (index > -1) {
        arrayTasks.splice(index, 1);
      }
      document.getElementById(spanId).style.display = "none"
    }
  })
}

// TODO: всплывающие окна https://getbootstrap.com/docs/5.1/components/modal/
