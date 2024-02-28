// testSetup.js
const { JSDOM } = require("jsdom");

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.location = dom.window.location;
