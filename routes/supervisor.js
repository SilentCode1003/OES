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
const supervisorPath = `${__dirname}/data/supervisor/`;

/* GET home page. */
router.get('/', isAuth, function (req, res, next) {
    res.render('supervisors', {
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
        let sql = 'select * from master_supervisor';

        mysql.Select(sql, 'MasterSupervisor', (err, result) => {
            if (err) console.error(err);
            var data = [];

            result.forEach((key, item) => {
                var fullname = `${key.firstname} ${key.middlename == 'N/A' ? '' : key.middlename} ${key.lastname}`;
                var jsondata = helper.ReadJSONFile(`${supervisorPath}${key.image}`)
                jsondata.forEach((value, item) => {
                    data.push({
                        image: value.base64,
                        supervisorid: key.employeeid,
                        fullname: fullname,
                        status: key.status,
                    })
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
        let supervisorid = req.body.supervisorid;
        let firstname = req.body.firstname;
        let middlename = req.body.middlename == '' ? 'N/A' : req.body.middlename;
        let lastname = req.body.lastname;
        let department = req.body.department;
        let position = req.body.position;
        let type = '';
        let image = req.body.image;
        let status = dictionary.GetValue(dictionary.ACT())
        let createdby = req.session.fullname;
        let createddate = helper.GetCurrentDatetime();
        let master_supervisor = [];
        var filepath = `${supervisorPath}${supervisorid}.json`;
        var filename = `${supervisorid}.json`;
        var datajson = [];

        if(department == 'IT' || department == 'CABLING'){
            type = 'SUPERVISOR';
        }

        if(department == 'ADMIN'){
            type = 'ADMIN';
        }

        let sql_check = `select * from master_supervisor where ms_employeeid='${supervisorid}'`;
        mysql.Select(sql_check, 'MasterSupervisor', (err, result) => {
            if (err) console.error(err);

            if (result.length != 0) {
                return res.json({
                    msg: 'exist'
                })
            }
            else {
                datajson.push({
                    filename: filename,
                    base64: image,
                    fullname: `${firstname} ${lastname}`,
                })

                datajson = JSON.stringify(datajson, null, 2);
                helper.CreateJSON(filepath, datajson);

                console.log(`clicked!`);
                master_supervisor.push([
                    supervisorid,
                    firstname,
                    middlename,
                    lastname,
                    department,
                    position,
                    type,
                    filename,
                    status,
                    createdby,
                    createddate,
                ])

                console.log(master_supervisor);

                mysql.InsertTable('master_supervisor', master_supervisor, (err, result) => {
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

router.post('/getsubjects', (req, res) => {
    try {
        let userid = req.body.userid;
        let department = req.body.department;
        let status = dictionary.GetValue(dictionary.ACT());
        let sql = `select * from transaction_participant_subjects where ps_participantid='${userid}' and ps_status='${status}'`;

        mysql.Select(sql, 'TransactionParticipantSubject', (err, result) => {
            if (err) console.log(err);
            var data = [];

            result.forEach((key, item) => {
                var jsondata = helper.ReadJSONFile(`${supervisorPath}${key.subjectname}.json`)

                if (err) console.log(err);
                jsondata.forEach((value, item) => {
                    data.push({
                        image: value.base64,
                        supervisorid: key.subjectname,
                        fullname: value.fullname,
                        type: key.type,
                        status: key.status,
                    })
                })
            });

            console.log(data);

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