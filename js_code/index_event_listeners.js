const { PythonShell } = require('python-shell')
const utils = require('./utils')
const path = require('path')
const {arrayFiles} = require("./upload_file_functions");
let task = undefined;
const fs = require('fs');
const constants = require('./constants_js');


const options = {
   pythonPath: path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '../Python38/python.exe'),
  args: []
}

const Go = document.getElementById('go')
Go.addEventListener('click', () => {


  if (!utils.checkIfFilesAdded()) {return}
  options.args.push(task)
  utils.logToFile('OPTIONS:' + options)
     PythonShell.run(path.join(__dirname.replace('app.asar', 'app.asar.unpacked'), '../python_code/entry_python_point.py'), options, (err, results) => {

    utils.logToFile(`options: ${options.args}`)
    utils.logToElectron(`PYTHONSHELLRUN OPTIONS.ARGS: ${options.args}`)
    if (err) {
      utils.logToFile(`PYTHONSHELLRUN ERROR: ${err}`)
      alert(err)
    }
    utils.logToElectron(results)
    utils.logToElectron(`RESULT: ${results}`)
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


const buttons = document.getElementsByClassName("btn-mine")


for (let bn of buttons) {
  const button_id = bn.id
  bn.addEventListener("click", async function(){
    if (button_id === "3"||button_id === "4" )  {

      ipc.sendSync('choose_color_window')
      if (!fs.existsSync(`${constants.PATHS.utilsPath}${constants.PATHS.colorsFile}`)) {
        console.log("not exist, breaking")
        return;
      }
    }
    console.log("after if window")
    if (!this.classList.contains("active")){

      if (task !== undefined){
              document.getElementById(task).classList.remove("active")
            }
      this.classList.add("active");
      task = button_id
      console.log("Adding Active")
    }
    else {
      task = undefined;
      this.classList.remove("active");
    }


})}


