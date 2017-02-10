/**
 * Created by Peter_Kiss on 2017. 02. 09..
 */

var fs = require('fs'),
    path = require('path');

// multiline regex
var AMD = /define\(\[(.*?)\]/m,
    DYNAMIC = /require\(\[?(.*?)\]?\)/m,
    MULTI_PARENTHESIS = /['"]/g;

function ParseFile(AMDRoot, file, ignoreList) {
    this.file = path.relative(AMDRoot, file);
    this.root = AMDRoot;
    this.dirname = path.dirname(this.file);

    this.ignoreList = ignoreList.map(function (item) {
            return path.normalize(item);
        }) || [];

    this.moduleName = normalizeCommonJsModuleName.call(this, this.file);

    try {
        this.content = fs.readFileSync(this.file).toString();
        this.content = this.content.replace(/\s*/, '');
    } catch (e) {
        this.content = '';
    }
}

ParseFile.prototype.getModuleName = function () {
    return this.moduleName;
};

ParseFile.prototype.getStaticRefs = function () {
    return this.static;
};

ParseFile.prototype.getDynamicRefs = function () {
    return this.dynamic;
};

ParseFile.prototype.getRefs = function () {
    return reject(this.static.concat(this.dynamic), this.ignoreList);
};

ParseFile.prototype.parse = function () {
    this.static = collectStaticReferences.call(this);
    this.dynamic = collectDynamicReferences.call(this);
};

// we assume ONE module definition by "define" keyword at the beginning of a file
function collectStaticReferences() {
    var ret = [],
        matches = this.content.match(AMD);
    if (matches) {
        for (var matches = matches[1].split(','), i = 0;
             i < matches.length;
             i++) {
            var match = matches[i];
            ret.push(match);
        }
    }

    return applyIgnoreList.call(this, normalizeAMDModuleName, ret);
}

function collectDynamicReferences() {
    var ret = [],
        matches = [],
        nextPos = 0,
        remainingText = this.content;

    do {
        matches = DYNAMIC.exec(remainingText);
        if (matches) {
            nextPos = matches.index + matches[0].length;
            remainingText = remainingText.slice(nextPos);
            ret.push(matches[1])
        }
    } while (matches);

    return applyIgnoreList.call(this, normalizeCommonJsModuleName, ret);
}

function reject(arr, ignorelist) {
    var ret = [],
        i, el;
    for (i = 0; i < arr.length; i++) {
        el = arr[i];
        if (ret.indexOf(el) === -1) {
            ret.push(el);
        }
    }

    return ret;
}

function applyIgnoreList(normalizeCb, arr) {
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
        var el = normalizeCb.call(this, arr[i]);
        if (this.ignoreList.length === 0) {
            ret.push(el);
        } else {
            for (var j = 0; j < this.ignoreList.length; j++) {
                if (el.indexOf(this.ignoreList[j]) === -1) {
                    ret.push(el);
                }
            }
        }
    }
    return ret;
}

function normalizeCommonJsModuleName(name, ignore) {
    name = name.replace(MULTI_PARENTHESIS, '');
    name = path.join(this.dirname, name);
    return formatFileName(name);
}

function normalizeAMDModuleName(name, ignore) {
    name = name.replace(MULTI_PARENTHESIS, '');
    name = path.relative(this.root, name);
    name = formatFileName(name);
    return name;
}

function formatFileName(string) {
    return string.replace(/\.js$/, '');
}

module.exports = ParseFile;