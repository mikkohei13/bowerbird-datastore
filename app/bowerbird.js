
const url = require("url");
const querystring = require("querystring");

const bowerbirdGet = require("./bowerbird-get");
const bowerbirdPost = require("./bowerbird-post");

let parameters = {};

// --------------------------------------------------------------------
// Routing, API queries

// Decides what to do with the query
function requestHandler(request, response) {
	parameters.logError = logError;
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
	else
    {
        // Router - decides what to do based on URL
        if ("/post" == parameters.pathname && "POST" == parameters.request.method) {
            // Handle incoming data stream
            let body = "";
            parameters.request.on("data", function(chunk) {
                body += chunk;
            });
            parameters.request.on("end", function() {
                bowerbirdPost.post({"payload" : body, "parameters" : parameters});
            });
        }

        else if ("/get" == parameters.pathname && "GET" == parameters.request.method) {
            bowerbirdPost.get({"parameters" : parameters});
        }

        else {
            send404();
        }
    }
}

function send404() {
	console.log(parameters.request.url + " not found");
	parameters.response.writeHead(404);
	parameters.response.end("Page not found (404)");
}

const logError = function logError(e, statusCode, errorMessage) {
    console.log("ERROR: " + e);
    parameters.response.writeHead(statusCode);
    parameters.response.end("Error (" + statusCode + "):" + errorMessage);
};

module.exports = {
	"requestHandler" : requestHandler
};
