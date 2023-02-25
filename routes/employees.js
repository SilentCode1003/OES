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
        let status = dictionary.GetValue(dictionary.RSGD());
        let sql = `select * from master_employee where not me_status='${status}'`;

        mysql.Select(sql, 'MasterEmployee', (err, result) => {
            if (err) console.error(err);
            var data = [];
            var action = '<button class="approve-btn" id="updateBtn" name="updateBtn">UPDATE</button>';

            result.forEach((key, item) => {
                var fullname = `${key.firstname} ${key.middlename} ${key.lastname}`;
                data.push({
                    employeeid: key.employeeid,
                    fullname: fullname,
                    department: key.department,
                    position: key.position,
                    status: key.status,
                    createdby: key.createdby,
                    createddate: key.createddate,
                    action: action,
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
        let position = req.body.position;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let type = 'EMPLOYEE';
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
                    position,
                    type,
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
                key.position,
                key.type,
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

router.get('/getemployeecount', (req, res) => {
    try {
        let status = dictionary.GetValue(dictionary.ACT());
        let sql = `select count(*) totalemployees from master_employee where me_status='${status}'`;

        this.GetEmployeeCount(sql)
            .then(result => {
                res.json({
                    msg: 'success',
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    msg: error
                })
            })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.get('/getitcount', (req, res) => {
    try {
        let department = dictionary.GetValue(dictionary.IT());
        let status = dictionary.GetValue(dictionary.ACT());
        let sql = `select count(*) totalemployees from master_employee where me_status='${status}' and me_department='${department}'`;

        this.GetEmployeeCount(sql)
            .then(result => {
                res.json({
                    msg: 'success',
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    msg: error
                })
            })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.get('/getadmincount', (req, res) => {
    try {
        let department = dictionary.GetValue(dictionary.ADMIN());
        let status = dictionary.GetValue(dictionary.ACT());
        let sql = `select count(*) totalemployees from master_employee where me_status='${status}' and me_department='${department}'`;

        this.GetEmployeeCount(sql)
            .then(result => {
                res.json({
                    msg: 'success',
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    msg: error
                })
            })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.get('/getcablingcount', (req, res) => {
    try {
        let department = dictionary.GetValue(dictionary.CABLING());
        let status = dictionary.GetValue(dictionary.ACT());
        let sql = `select count(*) totalemployees from master_employee where me_status='${status}' and me_department='${department}'`;

        this.GetEmployeeCount(sql)
            .then(result => {
                res.json({
                    msg: 'success',
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    msg: error
                })
            })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

exports.GetEmployeeCount = (cmd) => {
    return new Promise((resolve, reject) => {
        mysql.SelectResult(cmd, (err, result) => {
            if (err) reject(err);

            resolve(result[0].totalemployees);
        })
    })
}