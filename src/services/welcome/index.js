const helper = global.helper;
const config = helper.config;
const utilites = require('../../utilities');
const logger = utilites.logger;
const knex   = require('../../../models').knexConn;

const log = logger('welcome.service');

/**
 * Welcome
 * 
 * @param {object} body
 * 
 */

module.exports = (body) => {
    log.info(config.test," models.test");
    return new Promise(async (resolve, reject) => {
        if (body) {
            resolve(body);
        } else {
            resolve({ message: "Welcome"});
        }
    })
}