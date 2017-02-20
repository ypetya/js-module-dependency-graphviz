/**
 * Created by Peter_Kiss on 2017. 02. 13..
 */

var fs = require('fs'),
    path = require('path');

var AMD = /define\(\[(.*?)\]/m, // multiline
    DYNAMIC = /require\(\[?(.*?)\]?\)/m, // multiline
    MULTI_PARENTHESIS = /['"]/g; // multiple matches

function ParseAMDFile(AMDRoot, file, ignoreList) {
    // AMDRoot - common for all AMD modules inspected
    this.root = AMDRoot;
    // dirname = the directory on the disk of the current file
    this.dirname = path.dirname(file);

    this.ignoreList = ignoreList.map(function (item) {
            return path.normalize(item);
        }) || [];

    this.moduleName = resolveAMDFromAbsoluteFile.call(this, file);

    try {
        this.content = fs.readFileSync(file).toString();
        this.content = this.content.replace(/[\s]+/g, '');
    } catch (e) {
        this.content = '';
    }
}

ParseAMDFile.createFileNameFromAMDModuleName = function (amdRoot, moduleName) {
    return path.join(amdRoot, moduleName + '.js');
};

ParseAMDFile.prototype.getModuleName = function () {
    return this.moduleName;
};

ParseAMDFile.prototype.getStaticRefs = function () {
    return this.static;
};

ParseAMDFile.prototype.getDynamicRefs = function () {
    return this.dynamic;
};

ParseAMDFile.prototype.getRefs = function () {
    return reject(this.static.concat(this.dynamic), this.ignoreList);
};

ParseAMDFile.prototype.parse = function () {
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
            match = match.replace(MULTI_PARENTHESIS, '');
            ret.push(match);
        }
    }

    return applyIgnoreList.call(this, resolveAMDFromRelative, ret);
}

function collectDynamicReferences() {
    var ret = [],
        matches = [],
        nextPos = 0,
        remainingText = this.content,
        match;

    do {
        matches = DYNAMIC.exec(remainingText);
        if (matches) {
            nextPos = matches.index + matches[0].length;
            remainingText = remainingText.slice(nextPos);
            match = matches[1].replace(MULTI_PARENTHESIS, '');
            ret.push(match);
        }
    } while (matches);

    return applyIgnoreList.call(this, resolveAMDFromRelative, ret);
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
// dynamic reference is relative to current file directory
function resolveCommonJsModuleName(fileName) {
    fileName = path.join(this.dirname, fileName);
    fileName = path.relative(this.root, fileName);
    return formatFileName(fileName);
}

function resolveAMDFromRelative(fileName) {
    return formatFileName(fileName);
}

// static reference is relative to AMD root
function resolveAMDFromAbsoluteFile(fileName) {
    fileName = path.relative(this.root, fileName);
    return formatFileName(fileName);
}

function formatFileName(string) {
    return string.replace(/\.js$/, '');
}

module.exports = ParseAMDFile;