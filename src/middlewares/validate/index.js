'use strict'
const utilites = require("../../utilities");
const logger = utilites.logger;

const log = logger('validate.index');

let validate = (rules) => {
  return (req, res, next) => {
    let body = req.payload || req.body || {};
    log.info("Reqesut body => ", { ...body }, rules);
    utilites.joiValidate(body, rules,  (error) => {
      if (error) {
        return next(error);
      }
      return next();
    });
  }
}

module.exports = validate;