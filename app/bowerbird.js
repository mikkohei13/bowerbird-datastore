
const url = require("url");
const querystring = require("querystring");

const bowerbirdGet = require("./bowerbird-get");
const bowerbirdPost = require("./bowerbird-post");

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

	// Check apikey
	if (process.env.APIKEY != givenAPIkey) {
	    send404();
	}

	// Router - decides what to do based on URL
	if ("/post" == parameters.pathname) {
        let status = bowerbirdPost.post(parameters);
	}

	else if ("/get" == parameters.pathname) {
        let status = bowerbirdPost.get(parameters);
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
