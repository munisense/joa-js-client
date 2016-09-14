/**
 * Joa.js, provides a way to communicate with the backoffice of Munisense using Javascript.
 * Created by Alex Burghardt, https://github.com/aal89
 * license MIT, http://www.opensource.org/licenses/mit-license
 * Project Page: https://github.com/munisense/joa-js-client
 *
 * @module Joa
 **/
var Joa = (function () {
    'use strict';
    /**
     * Joa is an object used to communicate with the backoffice of Munisense.<br/>
     * Note that the keyword `new` is not required to create a new instance of the Ratio object, since this is done for you.<br/>
     * In otherwords, `new Ratio( value )` is the same as `Ratio( value )`.
     *
     * @class Joa
     * @constructor
     * @param {String} [db] an arbitrair argument used for debugging the object.
     * @return {Joa} object that can be used to communicate to the backoffice.
     * @example Joa("hello word") outputs hello world to the console;
    **/
    var Joa = function (db) {
        console.log(db);
        return this;
    };
    /**
     * Represents the current set backoffice url. <br/>
     *
     * @property Ratio.backofficeUrl
     * @type {String}
     */
    Joa.backofficeUrl = "http://www.google.com";
}());