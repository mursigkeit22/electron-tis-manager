const fs = require('fs')
const constants = require('./constants_js')

function logToFile (text) {
  fs.appendFileSync(`${constants.PATHS.logPath}js.log`, text + '\r\n', 'utf8')
}
function objectListToString (list) {
  return JSON.stringify(list.map(a => JSON.stringify(a)))
}

function checkIfFilesAdded () {
  if (!fs.existsSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`)) {
    logToFile(`File ${constants.PATHS.namesFile} doesn't exist`)
    return false
  }
  const text = fs.readFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, 'utf8')
  return text.length !== 0
}

function deleteColorsFile () {
  if (fs.existsSync(`${constants.PATHS.utilsPath}${constants.PATHS.colorsFile}`)) {
    fs.unlinkSync(`${constants.PATHS.utilsPath}${constants.PATHS.colorsFile}`)
  }
}

module.exports = { logToFile, objectListToString, checkIfFilesAdded, deleteColorsFile }
