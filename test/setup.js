// setup JSDOM
require('jsdom-global')()

// make expect available globally
global.expect = require('expect')

var chai = require("chai");

global.assert = chai.assert;
global.axios = require('axios');
global.MockAdapter = require('axios-mock-adapter');