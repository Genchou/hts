var https = require("https");
var moment = require("moment");
var cloudscraper = require("cloudscraper")

var options = {
    headers: {
        accept: "*/*",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36"
    },
    port: 443,
    method: "GET",
    hostname: "www.infotec.be"
};

exports.requestSchedule = function(line, callback) {
    var today = moment();
    requestPath = "https://infotec.be/published/Horaire.axd?date=" + today.format("YYYY-MM-DD") + "&ligne=" + line;
    cloudscraper.get(requestPath, (error, response, body) => {
        if (error) {
            callback("{ 'status': 'error' }");
        } else {
            callback(body);
        }
    })
    // options.path = "/published/Horaire.axd?date=" + today.format("YYYY-MM-DD") + "&ligne=" + line;
    // var response = "";
    // var req = https.request(options, (res) => {
    //     res.setEncoding("utf8");
    //     res.on("data", (chunk) => {
    //         response += chunk;
    //     });
    //     res.on("end", () => {
    //         callback(response);
    //     });
    // });

    // req.on("error", (err) => {
    //     console.log(err.message)
    // });

    // req.end();
};

exports.requestLines = function(callback) {
    var requestPath = "https://infotec.be/published/Ligne.axd?query=";

    cloudscraper.get(requestPath, (error, response, body) => {
        if (error) {
            callback("{ 'status': 'error' }");
        } else {
            callback(body);
        }
    });

    // options.path = "/published/Ligne.axd?query=";
    // var response = "";
    // var req = https.request(options, (res) => {
    //     res.setEncoding("utf8");
    //     res.on("data", (chunk) => {
    //         response += chunk;
    //     });
    //     res.on("end", () => {
    //         callback(response);
    //     });
    // });
    // req.on("error", (err) => {
    //     console.error(err.message);
    // });
    // req.end();
};
