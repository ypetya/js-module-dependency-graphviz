var ParseFile = require('./ParseFile'),
    GraphDescriptionOutput = require('./GraphDescriptionOutput'),
    traverse = require('./traverseByFollowingDependencies');

var AMD_ROOT = '.',
    IGNORE_LIST = [],
    START_FILE = process.argv[1],
    DISTANCE = Number(process.argv[2] || 5),
    visited = [];

var out = new GraphDescriptionOutput({
    traverse: startTraverse
});

out.generate();

function startTraverse(printDeps) {
    var parser = new ParseFile(AMD_ROOT, START_FILE, IGNORE_LIST),
        startModule = parser.getModuleName();

    traverse([startModule], DISTANCE, extractModuleDeps.bind(null, printDeps));
}

function extractModuleDeps(print, moduleName) {
    var deps = [];

    if (visited.indexOf(moduleName) === -1) {
        visited.push(moduleName);
        var fileName = createFileNameFromModuleName(moduleName),
            parser = new ParseFile(AMD_ROOT, fileName, IGNORE_LIST);
        parser.parse();
        var dependencies = parser.getRefs();
        for (var i = 0; i < dependencies.length; i++) {
            print(moduleName, dependencies[i]);
            deps.push(dependencies[i]);
        }
    }

    return deps;
}

function createFileNameFromModuleName(moduleName) {
    return moduleName + '.js';
}