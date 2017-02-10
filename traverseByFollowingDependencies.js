module.exports = function traverseByFollowingDependencies(references, maxDepth, extractReferencesCb) {
    if (maxDepth === 0) return;
    var aModule,
        childRefs = [];
    for (var i = 0; i < references.length; i++) {
        aModule = references[i];
        childRefs = childRefs.concat(extractReferencesCb(aModule));
    }

    traverseByFollowingDependencies(childRefs, maxDepth - 1, extractReferencesCb);
};