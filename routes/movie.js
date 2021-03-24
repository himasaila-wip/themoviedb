var express = require('express');
var service = require("./service/movieService");
var router = express.Router();
var request = require('request');
var axios = require('axios');
var https = require('https');
var cb = require('../cb');

//getting all movie data
router.get('/', cb, function (req, res, next) {
    service.wholeResponse(req, res)
});
//filter by popularity
router.get('/popularity', cb, function (req, res, next) {
    service.popularity(req, res)
});

//filter by date
router.get('/date', cb, function (req, res, next) {
    service.date(req, res);
});

//filter by  genres(using axios.all)
router.get('/genre', cb, function (req, res, next) {
    service.genres(req, res);
});

//filter by using popularity date & gen
router.get('/filter', cb, function (req, res, next) {
    service.filter(req, res);

});



module.exports = router;