
const logger = require('electron-log')
const fs = require('fs')
const constants = require('./constants_js')

function logToElectron (text) {
  logger.info(text)
}
function logToFile (text) {
  fs.appendFileSync(`${constants.PATHS.logPath}js.log`, text + '\r\n', 'utf8')
}
function objectListToString (list) {
  return JSON.stringify(list.map(a => JSON.stringify(a)))
}




module.exports = { logToElectron, logToFile, objectListToString }
