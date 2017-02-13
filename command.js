var ParseFile = require('./ParseAMDFile'),
    Visitor = require('./Visitor');

var IGNORE_LIST = [],
    START_FILE = process.argv[2],
    DISTANCE = Number(process.argv[3] || 5),
    AMD_ROOT = process.argv[4] || '.';


function start(actionFn) {
    var v = new Visitor(actionFn, startFn, nextFn);
    v.start(DISTANCE);
}

function startFn() {
    var parser = new ParseFile(AMD_ROOT, START_FILE, IGNORE_LIST),
        startModule = parser.getModuleName();
    return [startModule];
}

function nextFn(moduleName) {
    var fileName = ParseFile.createFileNameFromAMDModuleName(AMD_ROOT, moduleName),
        parser = new ParseFile(AMD_ROOT, fileName, IGNORE_LIST);
    parser.parse();
    return parser.getRefs();
}

module.exports = start;