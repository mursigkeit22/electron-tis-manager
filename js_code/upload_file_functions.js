const fs = require('fs')
const { ipcRenderer } = require('electron')
const constants = require('./constants_js')
const utils = require('./utils')
let globalFileIdNumber = 0
const arrayFiles = []

function rewrite () {
  utils.logToFile('In rewrite')
  fs.writeFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, '')
  for (const el of arrayFiles) {
    fs.appendFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, el.name + '\n')
    fs.appendFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, el.path + '\n')
  }
  const text = fs.readFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, 'utf8')
  fs.writeFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, text)
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
    fs.writeFileSync(`${constants.PATHS.utilsPath}dialog_data.txt`,
      'warning??Упс!??' + badNames)
    ipcRenderer.sendSync('dialog_window')
  }
  if (badNames.length > 1) {
    fs.writeFileSync(`${constants.PATHS.utilsPath}dialog_data.txt`,
      'warning??Упс!??' + badNames)
    ipcRenderer.sendSync('dialog_window')
  }
}

function iterateThroughUploadedFiles (uploadedFiles, filesListText) {
  utils.logToFile('In iterateThroughUploadedFiles')

  const badNames = []

  for (const file of uploadedFiles.files) {
    globalFileIdNumber++
    if (nameAlreadyInList(file.name)) {
      badNames.push(" "+file.name)
      continue
    }

    filesListText += "<li id = 'divnum" + globalFileIdNumber + "'> "
    filesListText += file.name + ' ' +
            " <button class = 'del' onclick='upload_helpers.hideLine(" + globalFileIdNumber + " )'></button><p></p></li>"
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
  console.log(utils.objectListToString(arrayFiles))

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
