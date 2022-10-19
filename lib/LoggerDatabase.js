const fs = require("fs")

/**
 * @typedef placeholdersData
 * @property {string} logName
 * @property {string} name
 * @property {string} id
 * @property {string} time
 * @property {Date} rawTime
 * @property {message} string
 */

class LoggerFile {
    #filePath = "./LoggerLogs.log"
    #middlewares = []

    constructor(filePath){
        if(filePath) this.#filePath = filePath
        this._checkIfFileExists()
    }
    
    /** @private */
    _executeMiddlewares(...dataForMiddlewares){
        let dataAfterMiddleware = dataForMiddlewares

        for(const middleware of this.#middlewares){
            dataAfterMiddleware = middleware(...dataAfterMiddleware) ?? dataAfterMiddleware
        }

        return dataAfterMiddleware
    }

    /** @private */
    _checkIfFileExists(){
        if(fs.existsSync(this.#filePath)) return
        fs.writeFileSync(this.#filePath, "", "utf-8")
    }

    /**
     * Add a middleware to database save
     * @param {function(string, placeholdersData): void|string} middleware 
     */
    use(middleware){
        if(typeof middleware === "function"){
            this.#middlewares.push(middleware)
        }
    }

    /** @private */
    save(message, extraData){
        message = this._executeMiddlewares(message, extraData)
        fs.appendFileSync(this.#filePath, "\n" + message, "utf-8")
    }
}

module.exports = LoggerFile