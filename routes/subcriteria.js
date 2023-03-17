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
            var action = '<button class="approve-btn" id="updateBtn" name="updateBtn">UPDATE</button><br><button class="approve-btn" id="removeBtn" name="removeBtn">DELETE</button>';
            var data = [];

            result.forEach((key, item) => {
                data.push({
                    subcriteriacode: key.subcriteriacode,
                    criteria: key.criteria,
                    subcriteria: key.subcriteria,
                    createdby: key.createdby,
                    createddate: key.createddate,
                    action: action,
                })
            })

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

router.post('/delete', (req, res) => {
    try {
        let code = req.body.code;
        let sql = `delete from master_subcriteria where ms_subcriteriacode='${code}'`;

        mysql.SelectResult(sql, (err, result) => {
            if (err) console.error(err);

            console.log(result);
            res.json({
                msg: 'success'
            })
        })

    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/update', (req, res) => {
    try {
        let employeeid = req.body.employeeid;
        let firstname = req.body.firstname;
        let middlename = req.body.middlename == '' ? 'N/A' : req.body.middlename;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let password = req.body.password;
        let sql = `update master_users set 
        mu_firstname='${firstname}',
        mu_middlename='${middlename}',
        mu_lastname='${lastname}',
        mu_username='${username}',
        mu_password='${password}'
        where mu_userid='${employeeid}'`;

        mysql.Update(sql, (err, result) => {
            if (err) console.error(err);

            console.log(result);

            res.json({
                msg: 'success'
            })
        })


    } catch (error) {
        res.json({
            msg: error
        })
    }
})