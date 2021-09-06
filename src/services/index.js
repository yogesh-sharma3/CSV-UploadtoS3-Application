'use strict';

const welcome = require('./welcome');
const {csvUpload,dbInsert} = require('./csvUpload');

module.exports = {
    welcome,csvUpload,dbInsert
}