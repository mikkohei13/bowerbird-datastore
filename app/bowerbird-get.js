const MongoClient = require('mongodb').MongoClient;
let parameters = {};

function get(argumentsObj) {
    parameters = argumentsObj.parameters;

    let json = JSON.stringify(parameters.queryParts);
    console.log(json);

    MongoClient.connect(process.env.MLAB_CONNECTION, function(err, db) {
        if (err) {
            parameters.logStatus(err, 503, "Database connection failed.");
        }
        else {
            let query = {'bowerbird_set': 'owntracks'};

            let collection = db.collection(process.env.MLAB_COLL);

            collection.find(query).toArray(function(err, documents) {
                if (err) {
                    parameters.logStatus(err, 500, "Database query failed.");
                }
                else
                {
                    console.log("Found the following records");
                    console.log(documents);
                    parameters.response.end(JSON.stringify(documents));
                }
                db.close();
            });
        }
    });
}

module.exports = {
    "get" : get
};
