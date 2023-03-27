var express = require('express');
var router = express.Router();
require('dotenv').config();

const mysql = require('./repository/evaluationdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
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

router.post('/login', (req, res) => {
  try {
    let userid = req.body.userid;
    let password = req.body.password;
    let sql = `select * from master_users 
        where mu_username='${userid}' 
        and mu_password='${password}'`;

    mysql.Select(sql, 'MasterUsers', (err, data) => {
      if (err) console.error(err);

      if (data.length != 0) {

        req.session.isAuth = true;
        req.session.username = data[0].username;
        req.session.accounttype = data[0].type;
        req.session.userid = data[0].userid;
        req.session.department = data[0].department;
        req.session.fullname = `${data[0].firstname} ${data[0].middlename} ${data[0].lastname}`;

        res.json({
          msg: 'success'
        });

      }
      else {
        res.json({
          msg: 'none'
        })
      }
    })

  } catch (error) {
    res.json({
      msg: error
    });
  }
})

router.post('/loginuser', (req, res) => {
  try {
    let userid = req.body.userid;
    let sql = `select * from master_employee 
        where me_employeeid='${userid}'`;
    let status = 'ACTIVE';
    let year = helper.GetCurrentYear();

    mysql.Select(sql, 'MasterEmployee', (err, data) => {
      if (err) console.error(err);

      console.log(data);

      if (data.length != 0) {

        let sql_check = `select * from participant_details 
        where pd_participantid='${userid}'
        and pd_year='${year}'`;

        mysql.Select(sql_check, 'ParticipantDetails', (err, result) => {
          if (err) console.log(err);

          console.log(result);

          if (result.length != 0) {
            if (result[0].status == status) {
              req.session.isAuth = true;
              req.session.accounttype = 'USER';
              req.session.userid = userid;
              req.session.department = data[0].department;
              req.session.fullname = `${data[0].firstname} ${data[0].middlename} ${data[0].lastname}`;

              console.log(`${userid} ${req.session.fullname} ${req.session.department}`)

              Create_ParticipantDetails(userid, req.session.fullname, req.session.department)
                .then(result => {
                  console.log(result);
                })
                .catch(error => {
                  console.log(error);
                });

              res.json({
                msg: 'success'
              });
            }
            else {
              console.log('NOT ACTIVE');
              res.json({
                msg: 'done',
              });
            }
          }
          else {
            req.session.isAuth = true;
            req.session.accounttype = 'USER';
            req.session.userid = userid;
            req.session.department = data[0].department;
            req.session.fullname = `${data[0].firstname} ${data[0].middlename} ${data[0].lastname}`;


            Create_ParticipantDetails(userid, req.session.fullname, req.session.department)
              .then(result => {
                console.log(result);
              })
              .catch(error => {
                console.log(error);
              });

            res.json({
              msg: 'success'
            });
          }
        })
      }
      else {
        res.json({
          msg: 'none'
        })
      }
    })

  } catch (error) {
    res.json({
      msg: error
    });
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {

      res.json({
        msg: err
      });

    }

    res.json({
      msg: "success"
    })
  });

});


//#region FUNCTIONS

function Create_ParticipantDetails(participantid, fullname, department) {

  return new Promise((resolve, reject) => {
    let data = [];
    let year = helper.GetCurrentYear();
    let details = '';
    let createdby = fullname;
    let createddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let transaction_participant_subjects = [];
    let subjectid = [];

    console.log(participantid);

    let sql_check = `select * from participant_details where pd_participantid='${participantid}' and pd_year='${year}'`;
    mysql.Select(sql_check, 'ParticipantDetails', (err, result) => {
      if (err) reject(err);

      if (result.length != 0) {

        resolve('exist')
      }
      else {
        let sql_supervisor = ``;

        if (department == 'IT') {
          sql_supervisor = `select * from master_supervisor where ms_status='${status}' and ms_department in ('IT','CABLING','ADMIN')`;
        }
        if (department == 'ADMIN') {
          sql_supervisor = `select * from master_supervisor where ms_status='${status}' and ms_department in ('ADMIN')`;
        }
        if (department == 'CABLING') {
          sql_supervisor = `select * from master_supervisor where ms_status='${status}' and ms_department in ('CABLING','ADMIN')`;
        }
        //further extension of filters

        mysql.Select(sql_supervisor, 'MasterSupervisor', (err, result) => {
          if (err) reject(err);

          console.log(result);
          result.forEach((key, item) => {
            details += `${key.employeeid}<br>`;
            subjectid.push({
              employeeid: key.employeeid,
              type: key.type,
            })
          });

          data.push([
            participantid,
            year,
            details,
            status,
            createdby,
            createddate,
          ])

          mysql.InsertTable('participant_details', data, (err, result) => {
            if (err) reject(err);

            console.log(result);
          })

          let sql_check = `select * from participant_details where pd_participantid='${participantid}'`;
          mysql.Select(sql_check, 'ParticipantDetails', (err, data) => {
            if (err) reject(err);

            console.log(data);
            if (data.length != 0) {
              var detailid = data[0].detailid;

              subjectid.forEach((key, item) => {
                transaction_participant_subjects.push([
                  detailid,
                  participantid,
                  year,
                  key.employeeid,
                  key.type,
                  status,
                  createdby,
                  createddate
                ])
              })

              mysql.InsertTable('transaction_participant_subjects', transaction_participant_subjects, (err, result) => {
                if (err) reject(err);

                console.log(result);
              })
            }
          })

        })
        resolve('new')
      }
    })
  })
}

//#endregion