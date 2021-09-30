
const logger = require("electron-log");
const fs = require("fs");
const constants = require("../constants_js");

function logToElectron(text) {
    logger.info(text);
}
function logToFile(text) {
    fs.appendFileSync(`${constants.PATHS.log_path}js.log`, `${text}\n`, 'utf8');
}
module.exports = { logToElectron,  logToFile};