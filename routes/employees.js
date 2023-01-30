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
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
    res.render('employees', {
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
        let sql = 'select * from master_employee';

        mysql.Select(sql, 'MasterEmployee', (err, result) => {
            if (err) console.error(err);
            var data = [];

            result.forEach((key, item) => {
                var fullname = `${key.firstname} ${key.middlename} ${key.lastname}`;
                data.push({
                    employeeid: key.employeeid,
                    fullname: fullname,
                    department: key.department,
                    status: key.status,
                    createdby: key.createdby,
                    createddate: key.createddate,
                })
            });

            res.json({
                msg: 'success',
                data: data
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
        let employeeid = req.body.employeeid;
        let firstname = req.body.firstname;
        let middlename = req.body.middlename == '' ? 'N/A' : req.body.middlename;
        let lastname = req.body.lastname;
        let department = req.body.department;
        let status = dictionary.GetValue(dictionary.ACT())
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let master_employee = [];

        let sql_check = `SELECT * FROM master_employee where me_employeeid='${employeeid}'`;

        mysql.Select(sql_check, 'MasterEmployee', (err, result) => {
            if (err) console.error(err);

            if (result.length != 0) {
                return res.json({
                    msg: 'exist'
                })
            }
            else {
                master_employee.push([
                    employeeid,
                    firstname,
                    middlename,
                    lastname,
                    department,
                    '',
                    status,
                    createdby,
                    createddate,
                ])

                // console.log(master_employee);

                mysql.InsertTable('master_employee', master_employee, (err, result) => {
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

router.post('/excelsave', (req, res) => {
    try {
        let data = req.body.data;
        data = JSON.parse(data);
        master_employee = [];

        data.forEach((key, item) => {
            master_employee.push([
                key.employeeid,
                key.firstname,
                key.middlename,
                key.lastname,
                key.department,
                key.image,
                key.status,
                key.createdby,
                key.createddate,
            ]);
        })

        mysql.InsertTable('master_employee', master_employee, (err, result) => {
            if (err) {
                console.log(err);
                return res.json(
                    {
                        msg: 'error',
                        error: err
                    })
            }
            else {
                console.log(result);

                res.json(
                    {
                        msg: 'success'
                    })
            }
        })


    } catch (error) {
        res.json({
            msg: error
        })
    }
})