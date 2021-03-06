const MongoClient = require('mongodb').MongoClient;
let parameters = {};

function post(argumentsObj) {
    parameters = argumentsObj.parameters;
    const payload = argumentsObj.payload;
    let payloadObj;
    console.log("Payload before metadata: " + payload);

    try {
        payloadObj = JSON.parse(payload);
        payloadObj = appendMetadata(payloadObj);
    } catch (e) {
        parameters.logStatus(e, 400, "Invalid JSON body.");
        return false;
    }

    // Todo: Validate payload?, max size

    MongoClient.connect(process.env.MLAB_CONNECTION, function(err, db) {
        if (err) {
            parameters.logStatus(err, 503, "Database connection failed.");
        }
        else {
            let options = {};
            let collection = db.collection(process.env.MLAB_COLL);
            collection.insertOne(payloadObj, options, function(err, result) {
                if(err) {
                    parameters.logStatus(err, 500, "Database insertion failed.");
                }
                else
                {
                    // Respond with empty JSON
                    console.log("200 OK");
                    parameters.response.writeHead(200);
                    parameters.response.end(JSON.stringify([]));
                }
                db.close();
            });
        }
    });
}

function appendMetadata(payload) {
    console.log(parameters.queryParts);

    if (parameters.queryParts.bowerbird_set) {
        payload.bowerbird_set = parameters.queryParts.bowerbird_set;
    }
    if (parameters.queryParts.bowerbird_id) {
        payload.bowerbird_id = parameters.queryParts.bowerbird_id;
    }

    return payload;
}

module.exports = {
    "post" : post
};
