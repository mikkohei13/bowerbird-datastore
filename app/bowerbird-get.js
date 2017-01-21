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
            // Todo: expand, functionalize
            let query = {"bowerbird_set": parameters.queryParts.bowerbird_set};

            let limit = parseInt(parameters.queryParts.limit, 10);
            if (! Number.isInteger(limit)) {
                console.log("limit: " + limit);
                limit = 1; // default
            }

            let sortString = parameters.queryParts.sort;
            let sortParts = sortString.split(":");
            let sortOrder;

            if ("DESC" == sortParts[1]) {
                sortOrder = -1;
            }
            else {
                sortOrder = 1; // default
            }
            let sort = { [sortParts[0]] : sortOrder };

//            find( { qty: { $gt: 25 } } )

            let collection = db.collection(process.env.MLAB_COLL);

            collection.find(query).limit(limit).sort(sort).toArray(function(err, documents) {
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
