const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

let parameters = {};

function post(argumentsObj) {
    parameters = argumentsObj.parameters;
    payload = argumentsObj.payload;

    console.log("Payload: " + JSON.stringify(payload));

    let status;

    MongoClient.connect(process.env.MLAB_CONNECTION, function(err, db) {
        if (err == null)
        {
            status = "Connected correctly to server";
        }
        else
        {
            status = "No connection";
        }
        db.close();
        parameters.response.end(status);
    });
}

module.exports = {
    "post" : post
};
