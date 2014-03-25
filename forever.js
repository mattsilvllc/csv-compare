var path    = require('path');
var forever = require('forever');
var file    = path.join(__dirname,'app.js');

var options = {

};

forever.start(file, options);