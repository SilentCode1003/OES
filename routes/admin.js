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
    res.render('admin', {
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
        let sql = `select * from master_users`;

        mysql.Select(sql, 'MasterUsers', (err, result) => {
            if (err) console.error(err);
            var data = [];

            result.forEach((key, item) => {
                var fullname = `${key.firstname} ${key.middlename} ${key.lastname}`;
                data.push({
                    fullname: fullname,
                    username: key.username,
                    password: key.password,
                    type: key.type,
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
        let firstname = req.body.firstname;
        let middlename = req.body.middlename == '' ? 'N/A' : req.body.middlename;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let password = req.body.password;
        let type = 'ADMINISTRATOR';
        let status = dictionary.GetValue(dictionary.ACT())
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let master_user = [];

        let sql_check = `SELECT * FROM master_users where mu_firstname='${firstname}' and mu_middlename='${middlename}' and mu_lastname='${lastname}'`;
        mysql.Select(sql_check, 'MasterUsers', (err, result) => {
            if (err) console.error(err);

            if (result.length != 0) {
                return res.json({
                    msg: 'exist'
                })
            }
            else {
                master_user.push([
                    firstname,
                    middlename,
                    lastname,
                    username,
                    password,
                    type,
                    status,
                    createdby,
                    createddate,
                ])

                console.log(master_user);

                mysql.InsertTable('master_users', master_user, (err, result) => {
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