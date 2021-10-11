
const logger = require('electron-log')
const fs = require('fs')
const constants = require('./constants_js')

function logToElectron (text) { //Todo: change to console
  logger.info(text)
}
function logToFile (text) {
  fs.appendFileSync(`${constants.PATHS.logPath}js.log`, text + '\r\n', 'utf8')
}
function objectListToString (list) {
  return JSON.stringify(list.map(a => JSON.stringify(a)))
}

function checkIfFilesAdded(){
  if (!fs.existsSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`)) {
    logToFile(`File ${constants.PATHS.namesFile} doesn't exist`)
    return false
  }
  let text = fs.readFileSync(`${constants.PATHS.utilsPath}${constants.PATHS.namesFile}`, 'utf8')
  return text.length !== 0;

}

module.exports = { logToElectron, logToFile, objectListToString, checkIfFilesAdded }
