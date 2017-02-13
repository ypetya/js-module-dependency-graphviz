/**
 * Created by Peter_Kiss on 2017. 02. 09..
 */

var amd = require('./parseAMDFile');

var AMD = /define\(\[(.*?)\]/m; // multiline

module.exports = function createParser(file, options) {

    return amd;
};