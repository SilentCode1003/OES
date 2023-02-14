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
    res.render('department', {
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
        let sql = 'select * from master_department';
        mysql.Select(sql, 'MasterDepartment', (err, result) => {
            if (err) console.error(err);

            res.json({
                msg: 'success',
                data: result,
            })
        })

    } catch (error) {
        res.json({
            msg: error
        });
    }
})

router.post('/save', (req, res) => {
    try {
        let department = req.body.department;
        let createdby = req.session.fullname = '' ? 'CREATOR' : req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let dataRaw = [];

        dataRaw.push(
            [department,
                createdby,
                createddate,]);

        console.log(dataRaw);


        let sql_check = `select * from master_department where md_department='${department}'`;
        mysql.Select(sql_check, 'MasterDepartment', (err, result) => {
            if (err) console.log(err);

            if (result.length != 0) {

                return res.json({
                    msg: 'exist'
                });
            }
            else {
                mysql.InsertTable('master_department', dataRaw, (err, result) => {
                    if (err) console.error(err);

                    console.log(result);

                    return res.json({
                        msg: 'success'
                    });
                });
            }
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
})