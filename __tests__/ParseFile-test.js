describe('parseFile', function () {
    var ParseFile;
    beforeEach(function () {
        ParseFile = require('../ParseFile');
    });

    it('should be a function', function () {
        expect(typeof ParseFile).toBe('function');
    });

    it('should pass acceptance test', function () {
        var p = new ParseFile('.', '__tests__/ParseFile-example.js.txt', ['this/ignored']);

        p.parse();

        var refs = p.getRefs();

        // FIXME not windows
        expect(refs.join(',') === "AMD1,AMD2,__tests__\\common1\\common2,__tests__\\common2,common3\\common4,__tests__\\common5")
            .toBe(true);
    });
});