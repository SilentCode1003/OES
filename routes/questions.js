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
    res.render('question', {
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
        let criterianame = req.body.criteria;
        let subcriterianame = req.body.subcriteria;
        let question = req.body.question;
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let master_criteria = [];

        let sql_check = `SELECT * FROM master_criteria_questions where mcq_criteria='${criterianame}' and mcq_subcriteria='${subcriterianame}' and mcq_question='${question}'`;
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
                    subcriterianame,
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

router.post('/getquestions', (req, res) => {
    try {
        let subject = req.body.subject;
        let sql = `select 
        mc_criterianame as criteria,
        mcq_subcriteria as subcriteria,
        mcq_question as question,
        mc_type as subjecttype
        from master_criteria
        inner join master_criteria_questions on master_criteria.mc_criterianame = master_criteria_questions.mcq_criteria
        where mc_type='${subject}'
        order by master_criteria.mc_criterianame`;

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