describe("Testing system module", function() {
    var system = fungears.connectors.system;

    it("Version Tests", function(){
        expect(system.version).not.toBe(undefined);
        expect(system.version).not.toBe(null);
    });

    it("Debug Tests", function() {
        expect(system.debug(true)).toBe(true);
    });

    it("Guard Tests", function() {

        expect(function() {
            system.guard.argumentNotNull(undefined, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentNotNull(null, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentNotNull({}, "argName");
        }).not.toThrow();

        expect(function() {
            system.guard.argumentNotNullOrEmpty(undefined, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentNotNullOrEmpty(null, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentNotNullOrEmpty("", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentNotNullOrEmpty("a value", "argName");
        }).not.toThrow();

        expect(function() {
            system.guard.argumentIsNumber(undefined, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsNumber(null, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsNumber("", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsNumber("1", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsNumber(1, "argName");
        }).not.toThrow();


        expect(function() {
            system.guard.argumentIsOptionalNumber("", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsOptionalNumber("1", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsOptionalNumber(null, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsOptionalNumber(undefined, "argName");
        }).not.toThrow();
        expect(function() {
            system.guard.argumentIsOptionalNumber(1, "argName");
        }).not.toThrow();

        expect(function() {
            system.guard.argumentIsFunction("", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsFunction("1", "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsFunction(null, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsFunction(undefined, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsFunction(1, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsFunction(function() {}, "argName");
        }).not.toThrow();

        expect(function() {
            system.guard.argumentIsDefined(undefined, "argName");
        }).toThrow();
        expect(function() {
            system.guard.argumentIsDefined(null, "argName");
        }).not.toThrow();
        expect(function() {
            system.guard.argumentIsDefined("1", "argName");
        }).not.toThrow();
        expect(function() {
            system.guard.argumentIsDefined(1, "argName");
        }).not.toThrow();
        expect(function() {
            system.guard.argumentIsDefined(function() {}, "argName");
        }).not.toThrow();

    });
});