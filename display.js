var start = require('./command'),
    GenerateDOTFile = require('./GenerateDOTFile'),
    out = new GenerateDOTFile({
        traverse: start
    });

out.generate();