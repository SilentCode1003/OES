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
    res.render('question', {
        title: process.env._TITLE,
        user: req.session.username,
        fullname: req.session.fullname,
        accounttype: req.session.accounttype,
        date: helper.GetCurrentDate()
    });
});

module.exports = router;

router.get('/load', (req, res) => {
    try {
        let sql = `select * from master_criteria_questions`;

        mysql.Select(sql, 'MasterCriteriaQuestions', (err, result) => {
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
        let criterianame = req.body.criterianame;
        let question = req.body.question;
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let master_criteria = [];

        let sql_check = `SELECT * FROM master_criteria_questions where mcq_criteria='${criterianame}' and mcq_question='${question}'`;
        mysql.Select(sql_check, 'MasterCriteriaQuestions', (err, result) => {
            if (err) console.error(err);

            if (result.length != 0) {
                return res.json({
                    msg: 'exist'
                })
            }
            else {
                master_criteria.push([
                    criterianame,
                    question,
                    createdby,
                    createddate,
                ])

                console.log(master_criteria);

                mysql.InsertTable('master_criteria_questions', master_criteria, (err, result) => {
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