var JOA = require("../src/JOA.js");

describe("A JOA's object url property", function() {    
    it("should be null when initiated.", function() {
        expect(JOA.url).toBeNull();
    });
});

describe("JOA's object url functions", function() {    
    it("should set the url property.", function() {
        expect(JOA.setUrl("backoffice.munisense.net")).toEqual();
    });
    it("should be able to get the url property.", function() {
        expect(JOA.url).toEqual("backoffice.munisense.net");
    });
});

describe("The header object", function() {    
    it("cannot be null.", function() {
        expect(JOA.header).not.toBeNull();
    });
});

describe("JOA's addZCLReport() function", function() {    
    it("should add a report to the queue and return that object.", function() {
        var obj1 = JOA.addZCLReport(123, "a", "b", "c", "d", "e", 1000, "hello");
        var obj2 = JOA.addZCLReport(123, null, null, "c", "d", "e", 1000, "hello");
        expect(obj1.id).toEqual(1);
        expect(obj2.id).toEqual(2);
        expect(obj1.endpointId).toEqual("a");
        expect(obj2.endpointId).toEqual("0x0a");
        expect(obj1.profileId).toEqual("b");
        expect(obj2.profileId).toEqual("0xf100");
        expect(obj1.value).toEqual("hello");
        expect(obj2.value).toEqual("hello");
    });
});

describe("JOA's removeMessage() function", function() {    
    it("should remove the message of the given id.", function() {
        var obj3 = JOA.addZCLReport(123, null, null, "c", "d", "e", 1000, "hello");
        expect(JOA.removeMessage(3).id).toEqual(3);
    });
});

describe("The custom toString function", function() {    
    it("should show a representation of a JOA payload and not contain any errors.", function() {
        expect(JOA.toString()).toEqual("toString example");
    });
});