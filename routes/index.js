var express = require('express');
var router = express.Router();
const mysql = require('mysql2'); 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Lesson 10' });
});

module.exports = router;
