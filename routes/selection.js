var express = require('express');
var router = express.Router();

const helper = require('./repository/customhelper');
const mysql = require('./repository/evaluationdb');
const dictionary = require('./repository/dictionary');
const Filter = require('bad-words');
const filipinoBadwords = require('filipino-badwords-list');
const filter = new Filter({ list: filipinoBadwords.array });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('selection', {
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


router.post('/generatereport', (req, res) => {
  try {
    let supervisorid = req.body.supervisorid;
    let userid = req.body.userid;
    let data = req.body.data;
    let comment = req.body.comment;
    let goodcomment = req.body.goodcomment;
    let improvementcomment = req.body.improvementcomment;
    let transaction_evaluation = [];
    let transaction_evaluation_comment = [];
    let transaction_evaluation_goodcomment = [];
    let transaction_evaluation_improvementcomment = [];
    let currentdate = helper.GetCurrentDate();
    let year = helper.GetCurrentYear();
    let status = 'DONE';
    let active = 'ACTIVE'
    let alias = helper.GenerateCode(userid);

    // console.log(data);
    // console.log(alias);
    // console.log(filter.isProfane(`${comment}`));

    if (filter.isProfane(`${comment}`) || filter.isProfane(`${goodcomment}`) || filter.isProfane(`${improvementcomment}`)) {
      console.log('Foul words detected!');
      return res.json({
        msg: 'badwords'
      })
    }
    else {
      console.log('No, foul words detected!');
      transaction_evaluation_comment.push([
        year,
        supervisorid,
        alias,
        comment,
        status,
      ])

      transaction_evaluation_goodcomment.push([
        year,
        supervisorid,
        alias,
        goodcomment,
        currentdate,
      ])

      transaction_evaluation_improvementcomment.push([
        year,
        supervisorid,
        alias,
        improvementcomment,
        currentdate,
      ])

      var badcomment = '';
      data.forEach((key, item) => {

        if (filter.isProfane(`${key.comment}`)) {
          badcomment += `${key.criteria} ${key.question} with comment of "${key.comment}"\n`;
        }
        else {
          transaction_evaluation.push([
            year,
            userid,
            supervisorid,
            alias,
            key.criteria,
            key.question,
            key.grade,
            key.comment,
            status,
          ]);
        }
      });

      if (badcomment != '') {
        console.log('Foul words detected!');
        return res.json({
          msg: 'badcomment',
          data: badcomment
        })
      }
      else {
        Insert_TransactionEvaluation(transaction_evaluation)
          .then(result => {
            console.log(result);

            Insert_TransactionEvaluationComment(transaction_evaluation_comment)
              .then(result => {
                console.log(result);

                Insert_TransactionGoodComment(transaction_evaluation_goodcomment)
                  .then(result => {
                    console.log(result);

                    Insert_TransactionNeedImprovementComment(transaction_evaluation_improvementcomment)
                      .then(result => {
                        console.log(result);

                        Update_TransactionParticipantSubjects(status, year, supervisorid, userid)
                          .then(result => {
                            console.log(result)

                            let sql = `select * from transaction_participant_subjects 
              where ps_year='${year}'
              and ps_participantid='${userid}'
              and ps_status='${active}'`;

                            mysql.Select(sql, 'TransactionParticipantSubject', (err, result) => {
                              if (err) console.error(err);

                              if (result.length != 0) {
                                return res.json({
                                  msg: 'success'
                                })
                              } else {

                                Update_ParticipantDetails(status, year, userid)
                                  .then(result => {
                                    console.log(result);
                                    res.json({
                                      msg: 'done'
                                    })
                                  })
                                  .catch(error => {
                                    res.json({
                                      msg: error
                                    })
                                  })
                              }
                            })
                          })
                          .catch(error => {
                            res.json({
                              msg: error
                            })
                          })
                      })
                      .catch(error => {
                        res.json({
                          msg: error
                        })
                      })
                  })
                  .catch(error => {
                    res.json({
                      msg: error
                    })
                  })
              })
          })
          .catch(error => {
            res.json({
              msg: error
            })
          })
      }


    }
  } catch (error) {
    res.json({
      msg: error
    })
  }
})


//#region FUNCTIONS
function Insert_TransactionEvaluation(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable('transaction_evaluation', data, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

function Insert_TransactionEvaluationComment(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable('transaction_evaluation_comment', data, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

function Update_TransactionParticipantSubjects(status, year, subjectid, participantid) {
  return new Promise((resolve, reject) => {
    let sql = `update transaction_participant_subjects 
    set ps_status='${status}'
    where ps_year='${year}'
    and ps_participantid='${participantid}'
    and ps_subjectname='${subjectid}'`;

    mysql.Update(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

function Update_ParticipantDetails(status, year, participantid) {
  return new Promise((resolve, reject) => {
    let sql = `update participant_details 
    set pd_status='${status}'
    where pd_year='${year}'
    and pd_participantid='${participantid}'`;

    mysql.Update(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

function Insert_TransactionNeedImprovementComment(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable('transaction_needimprovement_comment', data, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

function Insert_TransactionGoodComment(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable('transaction_good_comment', data, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}
//#endregion