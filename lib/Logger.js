const { generateId, generateDataForPlaceholder, colors, DefaultDateFormater } = require("./util.js");

const methodsForLogging = {
  warn: console.warn,
  info: console.info,
  error: console.error,
};

/**
 * @typedef config
 * @property {string} name The name of the logger
 * @property {Intl.DateTimeFormat} DateFormater The date formater of the logger
 *  */

class Logger {
  database;
  /** @type {config}*/
  #config = {
    name: "default",
    DateFormater: DefaultDateFormater,
  };
  /** @type {string} */
  id = generateId(8);
  /** @type {string} */
  placeholderString = "[{logName}][{name}:{id}][{time}] > {message}";

  /**
   * @param {config} config Config of the logger
   * @param {import("./LoggerDatabase") | undefined} database Database used by logger, can be a custom Database or the default Database(LoggerFile)
   */
  constructor(config, database) {
    if ("save" in config) {
      this.database = config;
    } else {
      Object.assign(this.#config, config);
      this.database = database;
    }
  }

  /** @private */
  _parsePlaceholderString(placeholdersData) {
    let result = this.placeholderString;
    for (const [key, value] of Object.entries(placeholdersData)) {
      const regexForPlaceholder = new RegExp("{" + key + "}", "g");
      result = result.replace(regexForPlaceholder, value);
    }

    return result;
  }

  /** @private */
  _saveToDb(message, placeholdersData, save = true) {
    if (!this.database || !save) return;

    if ("save" in this.database) {
      this.database.save(message);
    }
  }

  /** @private */
  _baseLog(logName, message, saveInDb) {
    const placeholdersData = generateDataForPlaceholder(
      { message: JSON.stringify(message, null, "\t"), id: this.id, logName: logName, name: this.#config.name },
      this.#config.DateFormater
    );
    const stringToLog = this._parsePlaceholderString(placeholdersData);

    this._saveToDb(stringToLog, placeholdersData, saveInDb);
    return stringToLog;
  }

  /**
   * Logs a **information** to the console
   * @param {string} message - the message to display
   * @param {boolean} [saveInDb]
   */
  info(message, saveInDb) {
    const logMessage = this._baseLog("Info", message, saveInDb);
    console.info(colors.White, logMessage);
  }
  log = this.info;

  /**
   * Logs a **warn** to the console
   * @param {string} message - the message to display
   * @param {boolean} [saveInDb]
   */
  warn(message, saveInDb) {
    const logMessage = this._baseLog("Warn", message, saveInDb);
    console.info(colors.Yellow, logMessage);
  }
  /**
   * Logs a **error** to the console
   * @param {string} message - the message to display
   * @param {boolean} [saveInDb]
   */
  error(message, saveInDb) {
    const logMessage = this._baseLog("Error", message, saveInDb);
    methodsForLogging.info(colors.Red, logMessage);
  }

  /**
   * Logs a **error** to the console
   * @param {string} message - the message to display
   */
  fatalError(message) {
    const logMessage = this._baseLog("FATAL", message, true);
    methodsForLogging.info(colors.Red, logMessage);
  }
}

module.exports = Logger;
