
const url = require("url");
const querystring = require("querystring");
const fs = require("fs");

//const get = require("./get");

let parameters = {};

// --------------------------------------------------------------------
// Routing, API queries

// Decides what to do with the query
function requestHandler(request, response) {
	parameters.request = request;
	parameters.response = response;

	parameters.urlParts = url.parse(parameters.request.url);
	parameters.queryParts = querystring.parse(parameters.urlParts.query);
	parameters.pathname = parameters.urlParts.pathname;

//	console.log(parameters);

	let givenAPIkey = parameters.queryParts.apikey;

	if (process.env.APIKEY != givenAPIkey) {
		send404();
	}

	// Router - decides what to do based on URL
	if ("/post" == parameters.pathname) {

		/*
		get.https(
			"host",
			("path" + ),
			callback
		);

		function callback(err, results) {
			getVihkolatest(results);
		});
		*/
		parameters.response.end("OK!");
	}

	else {
		send404();
	}
}

function send404() {
	console.log(parameters.request.url + " not found");
	parameters.response.writeHead(404);
	parameters.response.end("Page not found 404");	
}

module.exports = {
	"requestHandler" : requestHandler
};