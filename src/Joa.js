/**
 * JOA.js, provides a way to communicate with the backoffice of Munisense using Javascript.<br />
 * Created by Alex Burghardt, https://github.com/aal89<br />
 * license MIT, http://www.opensource.org/licenses/mit-license<br />
 * Project Page: https://github.com/munisense/JOA-js-client<br />
 *
 * @module JOA
 **/
var JOA = (function () {
    "use strict";
    /**
     * Represents the current set backoffice url. <br/>
     *
     * @property JOA.url
     * @type {String}
     */
    var url = null;
    /**
     * Special characters used by the JOA protocol. <br/>
     *
     * @property JOA.char
     * @type {Object}
     */
    var char = {
        tab: "\u0009",
        eol: "\u000A" //might also be \u000D or a combination of both, tests should be conclusive
    };
    /**
     * The header object used to construct a valid header for a particular request. <br/><br/>
     * gatewayIdentifier: The gateway identifier is a 32bit value formatted as an IP address.
     * This IP address will not be the address of the sending node or the backoffice, but
     * a virtual identifier assigned to this device.<br/>
     * The address will be an address in the private range defined in RFC1918.<br/><br/>
     * protocolVersion: The HTTP POST content starts with a header indicating protocol and version.
     * This contains the protocol-and-version string to be used in the header. Default is MuniRPCv2:.
     * Note: this is a private property and cannot be changed<br/><br/>
     * attribute: A header can also contain an optional comma separated list of value-attribute pairs.<br/>
     * attribute.vendor: The 'vendor' attribute is a string containing the assigned vendor name. A vendor field is required.<br/>
     * attribute.hash: The 'hash' attribute is the MD5 hash of the shared secret concatenated with the contents of the full
     * HTTP POST, including the header without a hash attribute. This value is required when using security level 3 or 4.<br/>
     * attribute.secret: The 'secret' attributes is the clear-text shared secret. This value is required for security level 2.<br/>
     * attribute.time: The 'time' attribute indicates a time request. This attribute does not need a attribute-value separator or a value.
     * The reply messages will include a time reply.
     *
     * @property JOA.header
     * @type {Object}
     */
    var header = {
        attribute: {
            vendor: null,
            hash: null,
            secret: null,
            time: null
        },
        gatewayIdentifier: null
    }, protocolVersion = "MuniRPCv2:";
    /**
     * A counter to be used for message id's. <br/>
     *
     * @property JOA.messageId
     * @type {Integer}
     */
    var messageId = 0;
    /**
     * An object to be used as an enumerator for message types. <br/>
     *
     * @property JOA.messageType
     * @type {Object}
     */
    var messageType = {
        ZCLReport: 0,
        ZCLMultiReport: 1,
        ZCLCommand: 2,
        TAZFrame: 3,
        TimeIndication: "t"
    };
    /**
     * A queue (array) containing all message objects.<br/>
     *
     * @property JOA.messages
     * @type {Array}
     */
    var messages = [];
    /**
     * JOA is an object used to communicate with the backoffice of Munisense. 
     * This object will be able to construct a (syntactically) valid payload according to the ms-tech-141003-3 specification.
     * This implementation only supports the MuniRPC version 2 protocol (JOA3).<br/>
     * There is no need to new this object as that is being done for you. Usage is through the JOA() object.
     * Note: all requests made to the backoffice are made asynchronously.
     *
     * @class JOA
     * @constructor
     * @param {String} [url] an optional parameter used to set the backoffice url.
     * @return {JOA} An object that can be used to communicate to the backoffice.
     * @example 
     JOA("https://www.google.com") initialises the JOA object with Google as the backoffice url;
    **/
    var JOA = function(url) {
        JOA.url = url;
        return this;
    };
    /**
     * Sets the url for the backoffice. <br />
     *
     * @method JOA.setUrl
     * @param {String} [url] the url where the backoffice is located.
    **/
    function setUrl(url) {
        JOA.url = url;
    }
    /**
     * Intialises the header fields in one go with an options object.<br/>
     *
     * @param {Object} [obj] options object containing all headers to be set.
     * @method JOA.headers
     * @example 
     JOA({
        attribute: {
            vendor: "jwz",
            time: "time"
        },
        gatewayIdentifier: "0.0.0.0",
        protocolVersion: "MuniRPCv2:"
    })
    **/
    function headers(obj) {
        JOA.header = obj;
    }
    /**
     * Tries to construct a valid header for the current message. <br />
     * Note: valid, in this context, means that all required fields are set and the result 
     * header string is constructed according to the specification, no validation is done
     * on the values of the header fields, the user is responsible for correct values.
     *
     * @param {Function} [cb] a callback function with an error and a result parameter.
     * @method JOA.constructHeader
    **/
    function constructHeader(cb) {
        var headerStr = "";
        var headerAttributeKeys = Object.keys(header.attribute);
        //gatewayIdentifier cannot be null if it is we fail to construct the header
        if(JOA.header.gatewayIdentifier !== null && JOA.header.gatewayIdentifier.length > 0) {
            //add the protocol and version indication to the header string
            headerStr += protocolVersion;
            //add the gatewayIdentifier
            headerStr += JOA.header.gatewayIdentifier;
            //loop through the attribute object and decide for each key if it has a value, if so we add
            //it to the header string
            for(var i = 0; i < headerAttributeKeys.length; i++) {
                var attributeKey = headerAttributeKeys[i];
                var attributeValue = JOA.header.attribute[attributeKey];
                if(attributeValue !== null && attributeValue.length > 0) {
                    //if statement for the time header field, if time is set we omit the = char
                    if(attributeKey == "time") {
                        headerStr += ",time";
                    } else {
                        headerStr += "," + attributeKey + "=" + attributeValue;
                    }
                }
            }
            //at last we're going to add a LF character to mark the header as complete
            headerStr += char.eol;
            //the final check is checking or the final string has a "vendor=" substring in it
            //the vendor header attribute is mandatory
            if(headerStr.indexOf("vendor=") !== -1) {
                //callback with the result, all went well and we constructed a valid header
                cb(null, headerStr);
            } else {
                //no vendor attribute set
                cb("no_vendor_attribute_set", null);
            }
        } else {
            cb("no_gatewayidentifier_set", null);
        }
    }
    /**
     * Will convert all message objects in the queue to a syntactically correct JOA message. <br/>
     *
     * @method JOA.constructMessages
     * @return {Array} An array consisting of all converted JOA messages.
     */
    function constructMessages() {
        //setup an temp array which will hold all the new converted messages
        var tmp = [];
        //loop through all the messages
        for(var i = 0; i < messages.length; i++) {
            var convertedMessage = "";
            var message = messages[i];
            //since every message can vary in number of field we need the number of keys in each object
            var messageKeys = Object.keys(message);
            //initially set the id and a tab char for the first few bytes of the converted message
            convertedMessage += message.id + char.tab;
            //for each message key add it to the converted message
            for(var j = 0; j < messageKeys.length; j++) {
                convertedMessage += message[messageKeys[i]] + char.tab;
            }
            //at last add an eol at the end of each message
            convertedMessage += chat.eol;
            //add it to the temp array
            tmp.push(convertedMessage);
        }
        //return the results
        return tmp;
    }
    /**
     * Adds a ZCL report to the message queue. <br/>
     *
     * @method JOA.addZCLReport
     * @param {String} [eui64] a 64bits address defined as an IEEE standard.
     * @param {String} [endpointId] when a single message device has multiple sensors of the same type, the endpointId
     * can be used to enumerate the sensors. The range of allowed values is 1 to 239. The best value to use when only
     * a single endpoint is used on a device is: 10 (0x0a). This field is also optional and when null is supplied 
     * 0x0a will be used.
     * @param {String} [profileId] an optional ZigBee specific field, if null is supplied the default 0xf100 will be used.
     * @param {String} [clusterId] clusters are an organizational unit of attributes of the same type. For example,
     * all temperature related attributes are defined in clusterid: 1026 (0x0402). All cluster id's must be coordinated
     * with Munisense before usage.
     * @param {String} [attributeId] attributes are the most specific fields defining a message. For example, the
     * calibration value in the temperature cluster has an attributeid of 5 (0x005), has a unit in C (celsius) and has
     * a data type int16s (0x29) and is presumed to be delivered with a scale factor of 0.01. Lists of definition are
     * available from ZigBee specifications or vendor specific clusters can be defined coordinated with Munisense.
     * @param {String} [dataTypeId] each attribute has a fixed data type. Sending this value is an indication how values
     * submitted should be handled and must be consistent throughout the implementation. Data types are defined in the
     * ZigBee specification.
     * @param {String} [timestamp] the timestamp is used to indicate the occurreence of a message. This value is a
     * positive numerical value up to 48 bits in size indicating the number of milliseconds since 1970-01-01 00:00:00
     * UTC, not adjusting for daylight savings time or leap seconds.
     * @param {String} [value] the value is an ASCII representation of the reported value. The datatypeId indicates how
     * a value should be notated:<br />
     * - Integer(0x20-0x27, 0x28-0x2f): The value is numeriv and optionally negative using a '-' minues
     * indication in front of the value for signed values.<br />
     * - Floating point (0x38-0x3a): Values are numeric, separating the integral and fractional parts with a '.' dot.<br />
     * - Character/octet string (0x41-0x44): Value starting with one or two bytes indicating the length of the field
     * completely encoded with base64.<br />
     * - Boolean (0x10): 0 for false, 1 for true.<br />
     * - Time (0xe2): This value is a positive numerical value up to 32bits in size indidcating the number of milliseconds
     * since 2000-01-01 00:00:00 UTC, not adjusting for daylight savings time or leap seconds.<br />
     * - Enumerations (0x30-0x31): Numeric value indicating an enumeration.
     * @return {Object} the inserted report.
     */    
    function addZCLReport(eui64, endpointId, profileId, cluserId, attributeId, dataTypeId, timestamp, value) {
        var obj = {
            id: generateId(),
            messageType: messageType.ZCLReport,
            eui64: eui64,
            endpointId: endpointId || "0x0a",
            profileId: profileId || "0xf100",
            clusterId: cluserId,
            attributeId: attributeId,
            dataTypeId: dataTypeId,
            timestamp: timestamp,
            value: value
        };
        messages.push(obj);
        return obj;
    }
    /**
     * Clears all inserted messages. This function will also be invoked when a successful post call was made. <br/>
     *
     * @method JOA.clearMessages
     */
    function clearMessages() {
        messages = [];
    }
    /**
     * Removes a sinlge message from the queue. <br/>
     *
     * @method JOA.removeMessage
     * @return {Object} the removed object or {} when nothing was removed.
     */
    function removeMessage(id) {
        for(var i = 0; i < messages.length; i++) {
            if(messages[i].id === id) {
                var obj = messages[i];
                messages.splice(i, 1);
                return obj;
            }
        }
        return {};
    }
    /**
     * Generates an unique id for this particular instance of JOA. These id's will be used for messages.
     * An id is a 32bit unsigned integer that is being kept track of and incremented each time this function is called. 
     * This process is as suggested by the JOA specification.<br/>
     *
     * @method JOA.generateId
     * @return {Integer} An incremented value to be used as an id, unique for this current instance of JOA.
     */
    function generateId() {
        messageId++;
        return messageId;
    }
    /**
     * Will convert all message objects in the queue to a valid JOA message. <br/>
     *
     * @param {Function} [cb] a callback function with an error and a result parameter.
     * @method JOA.constructJOAPayload
     */
    function constructJOAPayload(cb) {
        constructHeader(function(err, result) {
            if(err) {
                cb(err, null);
            } else {
                cb(null, result + constructMessages());
            }
        });
    }
    /**
     * Posts a constructed JOA payload to the backoffice of Munisense. 
     * Will clear the message queue and return the results as reported by the backoffice upon a
     * succcessful post. <br/>
     *
     * @method JOA.post
     * @param {Function} [cb] a function used to call back to whenever the HTTP post finishes.
     */
    function post(cb) {
        constructJOAPayload(function(err, result) {
            if(err) {
                cb(err, null);
            } else {
                //make ajax call
                //if all went well clear the messages and make a callback
                clearMessages();
                
                cb(null, result);
            }
        });
    }
    /**
     * A representation of the object in the format of a composed JOA payload (see also 'Example'
     * in the JOA specification document). 
     * It could also contain errors, if, for example, the header couldn't be contructed this
     * toString() function will output the error message instead of the payload.<br />
     *
     * @method JOA.toString
     * @return {String} A string based representation of a composed JOA payload.
    **/
    function toString() {
        constructJOAPayload(function(err, result) {
            if(err) {
                return err;
            } else {
                return result;
            }
        });
    }
    
    //JOA properties
    JOA.url = url;
    JOA.header = header;
    //JOA constructor
    JOA.prototype.constructor = JOA;
    //JOA methods
    JOA.headers = headers;
    JOA.setUrl = setUrl;
    JOA.addZCLReport = addZCLReport;
    JOA.clearMessages = clearMessages;
    JOA.removeMessage = removeMessage;
    JOA.post = post;
    JOA.toString = toString;
    
    //debug to be removed
    JOA.debug = "";
    
    return JOA;
}());

// Adds npm support
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = JOA;
    }
    exports.JOA = JOA;
} else {
    this.JOA = JOA;
}