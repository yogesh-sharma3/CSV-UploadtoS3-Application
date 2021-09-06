const bunyan = require('bunyan');
const httpContext = require('express-http-context');
const env = process.env.NODE_ENV;

const createLogger = (loggerName, skipContext) => {
  const logLevelObj = {
    testing: 'fatal',
    production: 'info'
  };
  
  let bunyanConfig = {
    name: loggerName,
    level: env && logLevelObj[env] ? logLevelObj[env] : 'trace'
  };
  
  let logger = bunyan.createLogger(bunyanConfig);
  
  let constructLogObj = (level) => {
    //let ctxObj = {};
    return (...args) => {
      try {
        const ApiHash = httpContext.get('ApiHash');
        if (!skipContext) {
          logger[level]({
            ApiHash: ApiHash
          },...args);
        } else {
          logger[level](...args);
        }
      } catch (error) {
        logger.error('Error in fetching Api Hash');
        logger.error(error);
        logger[level](...args);
      }
    };
  };
  let logObj = {
    info: constructLogObj('info'),
    trace: constructLogObj('trace'),
    debug: constructLogObj('debug'),
    warn: constructLogObj('warn'),
    error: constructLogObj('error'),
    fatal: constructLogObj('fatal')
  };
  return logObj;
};
  

module.exports = createLogger;
