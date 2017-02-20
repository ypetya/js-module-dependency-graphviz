var start = require('./command');

var DependencyDB = require('./DependencyDB'),
    db = new DependencyDB();

function visit(module, dep) {
    db.add(module, dep);
}

start(visit);

db.detectCircular();

if (db.modules.length) {
    console.log("\n\n *** There is a circular dependency among " + db.modules.length + '\n');
    db.print();
}