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
    res.render('subcriteria', {
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
        let sql = `select * from master_subcriteria`;

        mysql.Select(sql, 'MasterSubcriteria', (err, result) => {
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
        let criterianame = req.body.criteria;
        let subcriterianame = req.body.subcriteria;
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let master_subcriteria = [];

        let sql_check = `SELECT * FROM master_subcriteria where ms_criteria='${criterianame}' and ms_subcriteria='${subcriterianame}'`;
        mysql.Select(sql_check, 'MasterSubcriteria', (err, result) => {
            if (err) console.error(err);

            if (result.length != 0) {
                return res.json({
                    msg: 'exist'
                })
            }
            else {
                master_subcriteria.push([
                    criterianame,
                    subcriterianame,
                    createdby,
                    createddate,
                ])

                console.log(master_subcriteria);

                mysql.InsertTable('master_subcriteria', master_subcriteria, (err, result) => {
                    if (err) console.error(err);

                    console.log(result);

                    res.json({
                        msg: 'success'
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

router.post('/getsubcriteria', (req, res) => {
    try {
        let criteria = req.body.criteria;
        let sql = `select * from master_subcriteria where ms_criteria='${criteria}'`;

        mysql.Select(sql, 'MasterSubcriteria', (err, result) => {
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