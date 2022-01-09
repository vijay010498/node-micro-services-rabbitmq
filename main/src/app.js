"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
(0, typeorm_1.createConnection)().then(function (db) {
    var app = express();
    app.use(cors({
        origins: [
            "http://localhost:3000",
            "http://localhost:8080",
            "http://localhost:4200",
        ],
    }));
    app.use(express.json());
    app.listen(8001, function () {
        console.log("Server listening on port 8001");
    });
});
