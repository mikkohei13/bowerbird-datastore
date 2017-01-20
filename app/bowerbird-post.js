const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

let parameters = {};

function post(argumentsObj) {
    parameters = argumentsObj.parameters;
    payload = argumentsObj.payload;
    let data;

    console.log("Payload: " + payload);

    try {
        data = JSON.parse(payload);
    } catch (e) {
        logError(e, 400, "Invalid JSON body.");
        return false;
    }

    // Todo: Validate payload?, max size
    // Todo Handle errors

    MongoClient.connect(process.env.MLAB_CONNECTION, function(err, db) {
        if (err) {
            logError(e, 503, "Database connection failed.");
        }
        else {
            let options = {};
            let collection = db.collection(process.env.MLAB_COLL);
            collection.insertOne(data, options, function(err, result) {
                if(err) {
                    logError(e, 500, "Database insertion failed.");
                }
            });
        }
        db.close();
        parameters.response.writeHead(200);
        parameters.response.end("OK");
    });
}

function logError(e, statusCode, errorMessage) {
    console.log("ERROR: " + e);
    parameters.response.writeHead(statusCode);
    parameters.response.end("Error (" + statusCode + "):" + errorMessage);
}

module.exports = {
    "post" : post
};
