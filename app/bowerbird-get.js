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

            // query
            let query = {"bowerbird_set": parameters.queryParts.bowerbird_set};

            // limit
            let limit = 1; // default
            if (parameters.queryParts.limit) {
                let limitGot = parseInt(parameters.queryParts.limit, 10);
                if (Number.isInteger(limitGot)) {
                    limit = limitGot;
                }
            }

            // sort
            let sort = {}; // default: no sorting
            // Todo: validate sort argument format
            if (parameters.queryParts.sort) {
                let sortGot = parameters.queryParts.sort;
                let sortParts = sortGot.split(":");
                let sortOrder;
                if ("DESC" == sortParts[1]) {
                    sortOrder = -1;
                }
                else {
                    sortOrder = 1; // default
                }
                sort = { [sortParts[0]] : sortOrder };
            }

//            find( { qty: { $gt: 25 } } )

            let collection = db.collection(process.env.MLAB_COLL);

            collection.find(query).limit(limit).sort(sort).toArray(function(err, documents) {
                if (err) {
                    parameters.logStatus(err, 500, "Database query failed.");
                }
                else
                {
                    console.log("Documents:\n" + documents);
                    if ("csv" == parameters.queryParts.format) {
                        responseCSV(documents);
                    }
                    else {
                        responseJSON(documents); // default
                    }
                }
                db.close();
            });
        }
    });
}

const responseJSON = function responseJSON(documents) {
    parameters.response.end(JSON.stringify(documents));
};

// Simple CSV format for Owntracks data format
const responseCSV = function responseJSON(documents) {
    let CSV = "";
    documents.map(function toCSV(documentObj) {
        // Print all values to columns in the order they appear
        for (let property in documentObj) {
            CSV += documentObj[property] + "\t";
        }
        CSV += "\n";
        /*
        // Print Owntracks coordinate and time fields
        let date = new Date((documentObj.tst * 1000)); // temp, should return only unix time
        let dateString = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        CSV += documentObj.lat + "\t" + documentObj.lon + "\t" + documentObj.tst + "\t" + dateString + "\n";
        */
    });
    parameters.response.end(CSV);
};

module.exports = {
    "get" : get
};
