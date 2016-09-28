var JOA = require("../src/JOA.js");

describe("A JOA's object url property", function() {    
    it("should be null when initiated.", function() {
        expect(JOA.url).toBeNull();
    });
});

describe("JOA's object url functions", function() {    
    it("should set the url property.", function() {
        expect(JOA.setUrl("https://joa3.munisense.net/debug/")).toEqual();
    });
    it("should be able to get the url property.", function() {
        expect(JOA.url).toEqual("https://joa3.munisense.net/debug/");
    });
});

describe("The header object", function() {    
    it("cannot be null.", function() {
        expect(JOA.header).not.toBeNull();
    });
});

describe("Vendor header attribute", function() {    
    it("should be a mandatory value to be set by the user.", function() {
        JOA.headers({
            attribute: {
                vendor: null,
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("no_vendor_attribute_set");
        
        JOA.headers({
            attribute: {
                vendor: "",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("no_vendor_attribute_set");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug\n");
    });
});

describe("Gatewayidentifier header attribute", function() {    
    it("should be a mandatory value to be set by the user.", function() {
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: null
        });
        expect(JOA.toString()).toEqual("no_gatewayidentifier_set");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: ""
        });
        expect(JOA.toString()).toEqual("no_gatewayidentifier_set");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug\n");
    });
});

describe("Time header attribute", function() {    
    it("should be to set to true or false.", function() {
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug\n");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: true,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug,time\n");
    });
});

describe("Hash and secret header attribute", function() {    
    it("should be to set to true or false and the secret attribute should be set or not set accordingly.", function() {
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug\n");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: false,
                secret: "simplesecret"
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug\n");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: true,
                hash: true,
                secret: null
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("no_secret_set");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: true,
                hash: true,
                secret: ""
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("no_secret_set");
        
        JOA.headers({
            attribute: {
                vendor: "debug",
                time: false,
                hash: true,
                secret: "simplesecret"
            },
            gatewayIdentifier: "0.0.0.0"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:0.0.0.0,vendor=debug,hash=4928105608ed5adc908e5d4282c89c68\n");
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
        expect(JOA.removeMessage(3)).toEqual(true);
    });
});

describe("The toString and toHash function", function() {    
    it("should show a representation of a JOA payload and not contain any errors also the hashing should correct.", function() {
        JOA.clearMessages();
        JOA.addZCLReport("f104:00ff:0000:0001", null, null, "0x0402", "0x0000", "0x20", 1474552384381, "1");
        JOA.headers({
            attribute: {
                vendor: "androidnode",
                time: true,
                hash: true,
                secret: "waiga6ieGo4eefo2thaQuash4ahc4aid"
            },
            gatewayIdentifier: "10.32.16.1"
        });
        expect(JOA.toString()).toEqual("MuniRPCv2:10.32.16.1,vendor=androidnode,time,hash=2419746b3a7ed995a1caadb93c4973c3\n4	0	f104:00ff:0000:0001	0x0a	0xf100	0x0402	0x0000	0x20	1474552384381	1\n");
        expect(JOA.toHash()).toEqual("2419746b3a7ed995a1caadb93c4973c3");
    });
});

describe("The toHash function", function() {    
    it("should show a correct hash for even the most strangest payloads.", function() {
        JOA.clearMessages();
        JOA.headers({
            attribute: {
                vendor: "androidnode",
                time: true,
                hash: true,
                secret: "waiga6ieGo4eefo2thaQuash4ahc4aid"
            },
            gatewayIdentifier: "10.90.80.2"
        });
        JOA.addZCLReport("f104:00ff:0000:0001", null, null, "0x0402", "0x0000", "0x20", 1474552384381, "1");
        expect(JOA.toHash()).toEqual("7ba932af95a27356be566fc3b9cceece");
        
        JOA.addZCLReport("", null, null, "", "", "", 0, "12");
        expect(JOA.toHash()).toEqual("cc16d42460966abb333a90f4477c7437");
        
        JOA.addZCLReport("i", "do", "tests", "every", "day", "yeah", "", "a");
        expect(JOA.toHash()).toEqual("5b3c0aa767070f8846e04b0bff66c244");
        
        JOA.addZCLReport("f104:00ff:0000:000f", null, null, "", "", "", "", "");
        expect(JOA.toHash()).toEqual("fb3893d36d7664bda61e7fa441ca8465");
    });
});

describe("Adding a ZCL Multireport", function() {    
    it("should be added to the message queue and be able to be parsed correctly.", function() {
        JOA.clearMessages();
        JOA.headers({
            attribute: {
                vendor: "androidnode",
                time: true,
                hash: true,
                secret: "waiga6ieGo4eefo2thaQuash4ahc4aid"
            },
            gatewayIdentifier: "10.32.16.1"
        });
        JOA.addZCLMultiReport("f104:00ff:0000:0001", null, null, "0x0402", "0x0000", "0x20", 1474552384381, 500, ["1", "2"]);
        expect(JOA.toString()).toEqual("MuniRPCv2:10.32.16.1,vendor=androidnode,time,hash=c614b877ef42a5d3102e7c2c0b55f240\n9	1	f104:00ff:0000:0001	0x0a	0xf100	0x0402	0x0000	0x20	1474552384381	500	1	2\n");
        expect(JOA.toHash()).toEqual("c614b877ef42a5d3102e7c2c0b55f240");
    });
});

describe("Adding a ZCL command", function() {    
    it("should be added to the message queue and be able to be parsed correctly.", function() {
        JOA.clearMessages();
        
        JOA.addZCLCommand("f104:00ff:0000:0001", null, null, "0x0402", "1", "0x12", 1474552384381, "dGVzdA==");
        expect(JOA.toString()).toEqual("MuniRPCv2:10.32.16.1,vendor=androidnode,time,hash=6cfa3cb05e045c477d33cb6511ae6621\n10	2	f104:00ff:0000:0001	0x0a	0xf100	0x0402	1	0x12	1474552384381	dGVzdA==\n");
        expect(JOA.toHash()).toEqual("6cfa3cb05e045c477d33cb6511ae6621");
    });
});

describe("Md5 hashing functionality", function() {    
    it("should hash like any other md5 hashing function", function() {
        expect(JOA.md5("munisense_test_12345_!@#$%")).toEqual("a29f04502785f7a55253d1f13ae6f487");
    });
});