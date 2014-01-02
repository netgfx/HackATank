
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs   = require('fs');

var app = express();

// all environments
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/api', function(request, response) {
	console.log(request.query.data);
   response.jsonp({name:'Mike',age:28,awesomeLevel:'9000'});
});

app.get('/writeReplay',function(request, response){
	console.log(request.query.data);
	var id = new Date().getTime();
	fs.writeFile("../replay_"+id+".json", request.query.data, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
		response.jsonp({url:'http://178.32.72.20/replay_'+id+'.json'});
		setTimeout(deleteFile,20000,['../replay_'+id+'.json']);
    }
});

function deleteFile(fileName){
	fs.unlink(fileName[0],function(){
		console.log("File: ",fileName," DELETED!");
	});
}

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
