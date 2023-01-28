var express = require('express');
var router = express.Router();
require('dotenv').config();

function isAuth(req, res, next) {
    if (req.session.isAuth && req.session.accounttype == "ADMINISTRATOR") {
        next();
    }

    else {
        res.redirect('/');
    }
};

const mysql = require('./repository/evaluationdb');
const helper = require('./repository/customhelper');

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
    res.render('dashboard', {
        title: process.env._TITLE,
        user: req.session.username,
        fullname: req.session.fullname,
        accounttype: req.session.accounttype,
        date: helper.GetCurrentDate()
    });
});

module.exports = router;
