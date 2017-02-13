function DependencyDB() {
    this.modules = [];
}

DependencyDB.prototype.detectCircular = function () {
    this.removeUnused();
    var moduleName = this.findModuleWithoutDeps();

    while (moduleName) {
        console.log('Removing : ' + moduleName + ' left : ' + this.modules.length);
        this.remove(moduleName);
        this.removeUnused();
        moduleName = this.findModuleWithoutDeps();
    }
};

DependencyDB.prototype.print = function () {
    this.modules.forEach(
        function(module){
            console.log(module.toString());
        });
};


DependencyDB.prototype.removeUnused = function () {
    var allDeps = [];
    for (var i = 0; i < this.modules.length; i++) {
        for( var j=0; j< this.modules[i].deps.length; j++) {
            var dep = this.modules[i].deps[j];
            if(allDeps.indexOf(dep) === -1) {
                allDeps.push(dep);
            }
        }
    }
    for(i=0;i<allDeps.length;i++){
        if(!this.hasModule(allDeps[i])){
            this.remove(allDeps[i]);
        }
    }
};

DependencyDB.prototype.add = function (from, to) {
    if(from === "") {
        console.log('parse error.');
        return;
    }

    var ele;
    for (var i = 0; i < this.modules.length; i++) {
        if (this.modules[i].name === from) {
            ele = this.modules[i];
            break;
        }
    }
    if (!ele) {
        ele = new Module(from);
        this.modules.push(ele);
    }
    if (to) {
        ele.add(to);
    }
};

DependencyDB.prototype.remove = function (moduleName) {
    var currentModule;
    for (var i = 0; i < this.modules.length; i++) {
        currentModule = this.modules[i];
        // remove deps from every module
        currentModule.remove(moduleName);
        // remove module if this is the current
        if (currentModule.name === moduleName) {
            this.modules.splice(i, 1);
        }
    }
};

DependencyDB.prototype.findModuleWithoutDeps = function () {
    for (var i = 0; i < this.modules.length; i++) {
        if (!this.modules[i].deps.length) {
            return this.modules[i].name;
        }
    }
};

DependencyDB.prototype.hasModule = function (name) {
    for (var i = 0; i < this.modules.length; i++) {
        if (this.modules[i].name === name) return true;
    }
};

function Module(moduleName) {
    this.name = moduleName;
    this.deps = [];
}

Module.prototype.hasDependencyTo = function (moduleName) {
    return this.deps.indexOf(moduleName) > -1;
};

Module.prototype.add = function (moduleName) {
    if (this.deps.indexOf(moduleName) === -1) {
        this.deps.push(moduleName);
    }
};

Module.prototype.remove = function (moduleName) {
    for (var i = 0; i < this.deps.length; i++) {
        if (this.deps[i] === moduleName) {
            this.deps.splice(i, 1);
            return; //- there can't be duplications
        }
    }
};

Module.prototype.toString = function () {
    return this.name + ' -> ' + this.deps.join(',');
};

module.exports = DependencyDB;