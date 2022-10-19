const Logger = require("./lib/Logger.js")
const LoggerFile = require("./lib/LoggerDatabase.js")

module.exports = Logger
module.exports.Logger = Logger
module.exports.LoggerFile = LoggerFile
/**
 * @param {import("./lib/Logger").config} config 
 * @param {string} logFilePath
 */
module.exports.createLogger = function(config, logFilePath){
    const file = new LoggerFile(logFilePath)
    return new Logger(config, file)
}