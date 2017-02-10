function GraphDescriptionOutput(options) {
    this.name = options.name || 'Graph';
    this.rankdir = options.rankdir || '"LR"';
    this.traverse = options.traverse || console.error('Missing required traverse strategy');
}

GraphDescriptionOutput.prototype.generate = function () {
    console.log('digraph ' + this.name + ' {');
    this.traverse(printCb);
    console.log('}');
};

GraphDescriptionOutput.prototype.print = printCb;

function printCb(source, dep) {
    console.log("\t \"" + source + "\" -> \"" + dep + "\"");
}

module.exports = GraphDescriptionOutput;