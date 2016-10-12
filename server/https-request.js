var https = require("https");
var moment = require("moment");
var cloudscraper = require("cloudscraper");
var fs = require("fs");

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

    fs.readFile("cache_schedule_" + line + ".json", (err, data) => {
        if (err) {
            console.log("writing log file ...");
            cloudscraper.get(requestPath, (error, response, body) => {
                if (error) {
                    callback("{ 'status': 'error' }");
                } else {
                    var cache = {
                        last_update: today.format("YYYY-MM-DD H:m:s.SSSS"),
                        data: JSON.parse(body)
                    };
                    fs.writeFile("cache_schedule_" + line + ".json", JSON.stringify(cache), (err) => {
                        if (err) {
                            console.error(err);
                            callback("{ 'status': 'error' }");
                        } else {
                            callback(body);
                        }
                    });
                }
            });
        } else {
            var cache = JSON.parse(data);
            var diff = today.diff(cache.last_update);
            if (diff > 18000000) {
                console.log("cache is too old, refetching");
                cloudscraper.get(requestPath, (error, response, body) => {
                    if (error) {
                        callback("{ 'status': 'error' }");
                    } else {
                        cache.last_update = today.format("YYYY-MM-DD H:m:s.SSSS");
                        cache.data = JSON.parse(body);
                        fs.writeFile("cache_schedule_" + line + ".json", JSON.stringify(cache), (err) => {
                            if (err) {
                                callback("{ 'status': 'error' }");
                            } else {
                                callback(body);
                            }
                        });
                    }
                });
            } else {
                console.log("Fetching data from cache");
                var cache = JSON.parse(data);
                callback(JSON.stringify(cache.data));
            }
        }
    });

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
    var today = moment();

    fs.readFile("cache_line.json", (err, data) => {
        if (err) {
            console.log("writing log file ...");
            cloudscraper.get(requestPath, (error, response, body) => {
                if (error) {
                    console.error(error);
                } else {
                    var cache = {
                        last_update: today.format("YYYY-MM-DD H:m:s.SSSS"),
                        data: JSON.parse(body)
                    };
                    fs.writeFile("cache_line.json", JSON.stringify(cache), (err) => {
                        if (err) {
                            console.error(err);
                            callback("{ 'status': 'error' }");
                        } else {
                            callback(body);
                        }
                    });
                }
            });
        } else {
            var cache = JSON.parse(data);
            var diff = today.diff(cache.last_update);
            if (diff > 18000000) {
                console.log("cache is too old, refetching");
                cloudscraper.get(requestPath, (error, response, body) => {
                    if (error) {
                        callback("{ 'status': 'error' }");
                    } else {
                        cache.last_update = today.format("YYYY-MM-DD H:m:s.SSSS");
                        cache.data = JSON.parse(body);
                        fs.writeFile("cache_line.json", JSON.stringify(cache), (err) => {
                            if (err) {
                                callback("{ 'status': 'error' }");
                            } else {
                                callback(body);
                            }
                        });
                    }
                });

            } else {
                console.log("Fetching data from cache");
                var cache = JSON.parse(data);
                callback(JSON.stringify(cache.data));
            }
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
