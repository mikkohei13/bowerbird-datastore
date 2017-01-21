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
        parameters.logStatus(e, 400, "Invalid JSON body.");
        return false;
    }

    // Todo: Validate payload?, max size
    // Todo Handle errors

    MongoClient.connect(process.env.MLAB_CONNECTION, function(err, db) {
        if (err) {
            parameters.logStatus(e, 503, "Database connection failed.");
        }
        else {
            let options = {};
            let collection = db.collection(process.env.MLAB_COLL);
            collection.insertOne(data, options, function(err, result) {
                if(err) {
                    parameters.logStatus(e, 500, "Database insertion failed.");
                }
            });
        }
        db.close();
        parameters.logStatus(null, 200, "OK");
    });
}

module.exports = {
    "post" : post
};
