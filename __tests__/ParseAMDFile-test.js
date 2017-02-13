describe('parseFile', function () {
    var ParseFile;
    beforeEach(function () {
        ParseFile = require('../ParseAMDFile');
    });

    it('should be a function', function () {
        expect(typeof ParseFile).toBe('function');
    });

    it('should pass acceptance test', function () {
        var p = new ParseFile('.', '__tests__/ParseAMDFile-example.js.txt', ['this/ignored']);

        p.parse();

        var refs = p.getRefs();

        // FIXME not windows
        expect(refs.join(',') === "AMD1,AMD2,common1/common2,common2,../common3/common4,common5")
            .toBe(true);
    });
});