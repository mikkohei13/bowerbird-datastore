const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');

let parameters = {};

function post(argumentsObj) {
    parameters = argumentsObj.parameters;
    payload = argumentsObj.payload;

    console.log("Payload: " + payload);
    let data = JSON.parse(payload);

    let status;

    // Todo: Validate payload?, max size
    // Todo Handle errors

    MongoClient.connect(process.env.MLAB_CONNECTION, function(err, db) {
        if (err == null)
        {
            status = "Connected correctly to server";
            let options = {};
            let collection = db.collection(process.env.MLAB_COLL);
            collection.insertOne(data, options, function(err, result) {
                if(err) throw err;
            });
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
