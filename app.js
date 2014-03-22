var express = require('express'),
    multer = require('multer'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    app = express();

global.async = require('async');
global.csv = require('csv-string');
global._ = require('underscore');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());

app.use(multer({
  dest: './public/uploads/',
  limits: {
    files: 2
  }
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/compare', routes.compare);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
