var requester = require("./https-request.js");

var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

app.get("/schedule/:id", (req, res, next) => {
    requester.requestSchedule(req.params.id, (response) => {
        return res.send(JSON.parse(response));
    });
});

app.get("/lines", (req, res, next) => {
    requester.requestLines((response) => {
        return res.send(JSON.parse(response));
    });
});

app.listen(5678, () => {
    console.log("server started on 15678");
});


// var cloudscraper = require("cloudscraper");
// cloudscraper.get("https://infotec.be/published/Ligne.axd?query=ixe", function(error, response, body) {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log(body);
//     }
// });