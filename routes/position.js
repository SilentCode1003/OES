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
    res.render('position', {
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
        let sql = 'select * from master_position';
        mysql.Select(sql, 'MasterPosition', (err, result) => {
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
        let position = req.body.position;
        let createdby = req.session.fullname = '' ? 'CREATOR' : req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let dataRaw = [];

        dataRaw.push([
            position,
            department,
            createdby,
            createddate,
        ]);

        console.log(dataRaw);


        let sql_check = `select * from master_position where mp_department='${department}' and mp_position='${position}'`;
        mysql.Select(sql_check, 'MasterPosition', (err, result) => {
            if (err) console.log(err);

            if (result.length != 0) {

                return res.json({
                    msg: 'exist'
                });
            }
            else {
                mysql.InsertTable('master_position', dataRaw, (err, result) => {
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