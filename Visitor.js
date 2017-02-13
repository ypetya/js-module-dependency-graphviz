/**
 * Created by Peter_Kiss on 2017. 02. 13..
 */

var traverse = require('./traverseWithDepthLimit');

function Visitor(callbackFn, getStartNodesArrayFn, fetchNextNodesArrayFn) {
    this.onVisit = callbackFn;
    this.startFn = getStartNodesArrayFn;
    this.nextFn = fetchNextNodesArrayFn;

    this.visited = [];
}

Visitor.prototype.start = function startTraverse(maxDepth) {
    var startArr = this.startFn();
    traverse(startArr, maxDepth, this.visit.bind(this));
};

Visitor.prototype.visit = function visit(element) {
    var deps = [];

    if (this.visited.indexOf(element) === -1) {
        this.visited.push(element);

        var dependencies = this.nextFn(element), dependency;
        if(dependencies.length > 0 ) {
            for (var i = 0; i < dependencies.length; i++) {
                dependency = dependencies[i];

                this.onVisit(element, dependency);

                deps.push(dependency);
            }
        } else {
            this.onVisit(element);
        }
    }

    return deps;
};

module.exports = Visitor;