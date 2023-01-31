var express = require('express');
var router = express.Router();

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
const dictionary = require('./repository/dictionary')

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
    res.render('results', {
        title: process.env._TITLE,
        user: req.session.username,
        userid: req.session.userid,
        fullname: req.session.fullname,
        accounttype: req.session.accounttype,
        department: req.session.department,
        date: helper.GetCurrentDate()
    });
});

module.exports = router;


router.get('/loadyear', (req, res) => {
    try {
        let sql = `select distinct te_year as year from transaction_evaluation`;

        mysql.SelectResult(sql, (err, result) => {
            if (err) console.error(err);

            res.json({
                msg: 'success',
                data: result
            })
        })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})