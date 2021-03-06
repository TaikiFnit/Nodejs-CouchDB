var express = require('express');
var http = require('http');
var router = express.Router();

// options for request of http
var options = {
	hostname: '127.0.0.1',
	port: 5984,
	headers: {'Accept': 'application/json'}
};

// GET home page.
router.get('/', function(req, res) {

	// render index.ejs as a response
	renderIndex(req, res);
});

// posted from form index.ejs and put couchdb
router.post('/createNewDatabase', function(req, res){
	// put couchdb
	
	var data = req.body;

	options.method = 'PUT';
	options.path = '/' + data.dbname;

	var putReq = http.request(options, function(response){
		console.log('Bellow is result of request PUT to couchDB');
		console.log('Status of Put: ' + response.statusCode);
		console.log('Headers: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function(chunk){
			console.log('Body: ' + chunk);

			// render index.ejs as a response
			renderIndex(req, res);
		});
	});

	putReq.on('error', function(e){
		console.log('problem with request put: ' + e.message);
	});

	putReq.end();
});

router.post('/deleteDatabase', function(req, res){
	// send request del to couchdb

	var data = req.body;

	options.method = 'DELETE';
	options.path = '/' + data.dbname;

	var delReq = http.request(options, function(response){
		console.log('Bellow is result of request Del to CouchDB');
		console.log('Status of Del: ' + response.statusCode);
		console.log('Headers: ' + JSON.stringify(response.headers));

		response.setEncoding('utf8');

		response.on('data', function(chunk){
		console.log('Body: ' + chunk);
	
		// render index.ejs as a response
		renderIndex(req, res);

		});
	});

	delReq.on('error', function(e){
		console.log('problem with request del: ' + e.message);
	});

	delReq.end();
});


// rend user index.ejs
var renderIndex = function(req, res){

	//  get dblist, rend user index.ejs in a callback func.  
	options.method = 'GET';
	options.path = '/_all_dbs';

	var getReq = http.request(options, function(response){
		console.log('Bellow is result of request GET to couchDB');
		console.log('Status of Get: ' + response.statusCode);
		console.log('Headers: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function(chunk){
			console.log('Body: ' + chunk);
  			res.render('index', { title: 'Express', dblist: chunk});
		});
	});

	getReq.on('error', function(e){
		console.log('problem with request get: ' + e.message);
		console.log('maybe couchdb is not running.');
	});

	getReq.end();
};

module.exports = router;
