const fs = require('fs')
const { ipcRenderer } = require('electron')
const constants = require('./constants_js')
const utils = require('./utils')
let globalFileIdNumber = 0
const arrayFiles = []

function rewrite () {
  utils.logToFile('In rewrite')
  fs.writeFileSync(`${constants.PATHS.utilsPath}options.args.txt`, '')
  for (const el of arrayFiles) {
    fs.appendFileSync(`${constants.PATHS.utilsPath}options.args.txt`, el.name)
    fs.appendFileSync(`${constants.PATHS.utilsPath}options.args.txt`, '?')
    fs.appendFileSync(`${constants.PATHS.utilsPath}options.args.txt`, el.path)
    fs.appendFileSync(`${constants.PATHS.utilsPath}options.args.txt`, '?')
  }
  let text = fs.readFileSync(`${constants.PATHS.utilsPath}options.args.txt`, 'utf8')
  text = text.slice(0, -1) // убираем конечный вопросительный знак и перезаписываем
  fs.writeFileSync(`${constants.PATHS.utilsPath}options.args.txt`, text)
}

function hideLine (idNum) {
  utils.logToFile(`In hideLine. idNum ${idNum}`)
  const selectedDiv = document.getElementById('divnum' + idNum)
  selectedDiv.style.display = 'none'
  for (let i = 0; i < arrayFiles.length; i++) {
    if (arrayFiles[i].fileId === idNum) {
      arrayFiles.splice(i, 1)
    }
  }
  rewrite()
}
function showDialogDuplicateFiles (badNames) {
  utils.logToFile(`In showDialogDuplicateFiles, badNames: ${badNames}`)

  if (badNames.length === 1) {
    ipcRenderer.sendSync('synchronous-message',
      'Oops! I did it again',
      'file ' + badNames + ' is already added')
  }
  if (badNames.length > 1) {
    ipcRenderer.sendSync('synchronous-message',
      'Oops! I did it again',
      'files ' + badNames + ' are already added')
  }
}

function iterateThroughUploadedFiles (uploadedFiles, filesListText) {
  utils.logToFile('In iterateThroughUploadedFiles')

  const badNames = []

  for (const file of uploadedFiles.files) {
    globalFileIdNumber++
    if (nameAlreadyInList(file.name)) {
      badNames.push(file.name)
      continue
    }

    filesListText += "<div id = 'divnum" + globalFileIdNumber + "'> <br> "
    filesListText += file.name + ' ' +
            " <button type='button' class = 'del' onclick='upload_helpers.hideLine(" + globalFileIdNumber + " )'>x</button><br></div>"
    const aboutFiles = {
      fileId: globalFileIdNumber,
      name: file.name,
      path: file.path
    }
    arrayFiles.push(aboutFiles)
  }
  utils.logToFile(utils.objectListToString(arrayFiles))
  return [badNames, filesListText]
}

// we cannot have files with the same name (even if they have different paths),
// 'cause complete files will all be at the same location, and we don't want to change file names
function nameAlreadyInList (name) {
  utils.logToFile('In nameAlreadyInList')

  for (const obj of arrayFiles) {
    if (obj.name === name) {
      utils.logToFile(`Name ${name} is already in list`)
      return true
    }
  }
  return false
}
function writeFileNames () {
  utils.logToFile('In writeFileNames')
  utils.logToElectron(utils.objectListToString(arrayFiles))

  const uploadedFiles = document.getElementById('selectFiles')
  const filesListText = document.getElementById('nameList').innerHTML

  const [badNames, newFilesListText] = iterateThroughUploadedFiles(uploadedFiles, filesListText)
  rewrite()
  if (badNames.length > 0) {
    showDialogDuplicateFiles(badNames)
  }

  document.getElementById('selectFiles').value = ''
  document.getElementById('nameList').innerHTML = newFilesListText
}

module.exports = { writeFileNames, hideLine, arrayFiles }
