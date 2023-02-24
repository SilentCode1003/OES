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
const dictionary = require('./repository/dictionary')

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
    res.render('accesstype', {
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

router.get('/load', (req, res) => {
    try {
        let sql = `select * from master_accesstype`;

        mysql.Select(sql, 'MasterAccesstype', (err, result) => {
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

router.post('/save', (req, res) => {
    try {
        let accesstype = req.body.accesstype;
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let data = [];

        let sql_check = `select * from master_accesstype where ma_accesstype='${accesstype}'`;
        mysql.Select(sql_check, 'MasterAccesstype', (err, result) => {
            if (err) console.error(err)

            if (result.length != 0) {
                res.json({
                    msg: 'exist',
                })
            }
            else {
                data.push([
                    accesstype,
                    createdby,
                    createddate,
                ]);

                mysql.InsertTable('master_accesstype', data, (err, result) => {
                    if (err) console.error(err);

                    res.json({
                        msg: 'success',
                        data: result
                    })
                })
            }
        })

    } catch (error) {
        res.json({
            msg: error
        })
    }
})