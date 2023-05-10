var express = require('express');
var router = express.Router();


const helper = require('./repository/customhelper');
const mysql = require('./repository/evaluationdb');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('evaluation', {
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


router.post('/loadparticipants', (req, res) => {
  try {
    let year = helper.GetCurrentYear();
    let department = req.body.department;
    let sql = `select 
    pd_participantid as allias,
    pd_status as status,
    (select count(*) from transaction_participant_subjects where not ps_status='DONE' and ps_participantid = participant_details.pd_participantid) as remaining
    from participant_details
    inner join transaction_participant_subjects on participant_details.pd_participantid = transaction_participant_subjects.ps_participantid
    inner join master_employee on transaction_participant_subjects.ps_participantid = master_employee.me_employeeid
    where pd_year='${year}'
    and me_department='${department}'
    and not pd_status='DONE'
    group by pd_participantid
    order by pd_participantid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

      let data = [];

      result.forEach((key, item) => {
        data.push({
          allias: helper.GenerateCode(key.allias),
          status: key.status,
          remaining: key.remaining
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

router.get('/loadsummary', (req, res) => {
  try {
    let sql_supervisor = `select * from master_supervisor`;

    mysql.Select(sql_supervisor, 'MasterSupervisor', (err, result) => {
      if (err) console.log(err);
      var data = [];
      result.forEach((key, item) => {
        data.push({
          employeeid: key.employeeid,
          fullname: `${key.firstname} ${key.lastname}`,
          department: key.department,
          position: key.position,
        });
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

router.post('/getsummary', (req, res) => {
  try {
    let id = req.body.supervisorid;
    let year = helper.GetCurrentYear();
    let department = req.body.department;
    let sql = `call evaluation.GetEvaluationSummary('${year}', '${id}', '${department}'); `

    GetSummary(sql)
      .then(result => {
        console.log(result);

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
      msg: err
    })
  }
})

router.post('/getyearsummary', (req, res) => {
  try {
    let id = req.body.supervisorid;
    let year = req.body.year;
    let department = req.body.department;
    let sql = `call evaluation.GetEvaluationSummary('${year}', '${id}', '${department}'); `

    GetSummary(sql)
      .then(result => {
        console.log(result);

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
      msg: err
    })
  }
})

router.post('/getevaluationdetails', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let grade = req.body.grade;
    let year = helper.GetCurrentYear();
    let sql = '';

    console.log(grade);

    if (grade == 'O') {
      sql = `select te_criteria as criteria,
      te_question as question,
      te_grade as grade,
      count(te_grade) as count
      from transaction_evaluation
      where te_subjectid='${employeeid}'
      and te_year='${year}'
      and te_grade not in ('E','G','S','U','N')
      group by te_grade,te_criteria,te_question`;
    } else {
      sql = `select te_criteria as criteria,
      te_question as question,
      te_grade as grade,
      count(te_grade) as count
      from transaction_evaluation
      where te_subjectid='${employeeid}'
      and te_year='${year}'
      and te_grade = '${grade}'
      group by te_grade,te_criteria,te_question`;
    }




    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

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

router.post('/getyearevaluationdetails', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let grade = req.body.grade;
    let year = req.body.year;
    let sql = '';

    console.log(grade);

    if (grade == 'O') {
      sql = `select te_criteria as criteria,
      te_question as question,
      te_grade as grade,
      count(te_grade) as count
      from transaction_evaluation
      where te_subjectid='${employeeid}'
      and te_year='${year}'
      and te_grade not in ('E','G','S','U','N')
      group by te_grade,te_criteria,te_question`;
    } else {
      sql = `select te_criteria as criteria,
      te_question as question,
      te_grade as grade,
      count(te_grade) as count
      from transaction_evaluation
      where te_subjectid='${employeeid}'
      and te_year='${year}'
      and te_grade = '${grade}'
      group by te_grade,te_criteria,te_question`;
    }




    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

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

router.post('/getcomments', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let year = helper.GetCurrentYear();
    let sql = `select * from transaction_evaluation_comment where tec_supervisorid='${employeeid}' and tec_year='${year}'`;

    mysql.Select(sql, 'TransactionEvaluationComment', (err, result) => {
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

router.post('/getyearcomments', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let year = req.body.year;
    let sql = `select * from transaction_evaluation_comment where tec_supervisorid='${employeeid}' and tec_year='${year}'`;

    mysql.Select(sql, 'TransactionEvaluationComment', (err, result) => {
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

router.get('/loadrankings', (req, res) => {
  try {
    let year = helper.GetCurrentYear();
    let sql = `select distinct te_subjectid as subjectid,
    concat(master_supervisor.ms_lastname) as supervisorname, 
    if((select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='E') = 0,0,(select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='E')) as excellentpoints 
    from transaction_evaluation 
    inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
    where te_year='${year}'
    group by te_subjectid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

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

router.post('/loadyearrankings', (req, res) => {
  try {
    let year = req.body.year;
    let sql = `select distinct te_subjectid as subjectid,
    concat(master_supervisor.ms_lastname) as supervisorname, 
    if((select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='E') = 0,0,(select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='E')) as excellentpoints 
    from transaction_evaluation 
    inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
    where te_year='${year}'
    group by te_subjectid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

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

router.post('/loaddepartmentrankings', (req, res) => {
  try {
    let department = req.body.department;
    let year = helper.GetCurrentYear();
    let sql = '';

    if (department != 'ADMIN') {
      sql = `select distinct te_subjectid as subjectid,
          concat(master_supervisor.ms_lastname) as supervisorname, 
          if((select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='E') = 0,0,(select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='E')) as excellentpoints 
          from transaction_evaluation 
          inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
          where te_year='${year}'
          and ms_department='${department}'
          group by te_subjectid`;
    }
    else {
      sql = `select distinct te_subjectid as subjectid,
          concat(master_supervisor.ms_lastname) as supervisorname, 
          if((select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='5') = 0,0,(select count(*) from transaction_evaluation where te_subjectid = subjectid and te_grade='5')) as excellentpoints 
          from transaction_evaluation 
          inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
          where te_year='${year}'
          and ms_department='${department}'
          group by te_subjectid`;
    }

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

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

router.post('/getevaluationsummarydetails', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let department = req.body.department;
    let currentyear = helper.GetCurrentYear();
    let sql = '';

    if (department == 'ADMIN') {
      sql = `call evaluation.GetEvaluationSummaryDetails('${employeeid}', '${currentyear}', '${department}')`;
    }
    if (department == 'IT' || department == 'CABLING') {
      sql = `call evaluation.GetSupervisorEvaluationSummaryDetails('${employeeid}', '${currentyear}', '${department == 'IT' || department == 'CABLING' ? 'SUPERVISOR' : department}')`;
    }

    mysql.StoredProcedureResult(sql, (err, result) => {
      if (err) console.error(err);

      console.log(result);

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

router.post('/getevaluationsummary', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let department = req.body.department;
    let currentyear = helper.GetCurrentYear();
    let sql = '';

    if (department == 'ADMIN') {
      sql = `call evaluation.GetAdminEvaluationSummary('${employeeid}', '${currentyear}', '${department}')`;
    }
    if (department == 'IT' || department == 'CABLING') {
      sql = `call evaluation.GetSupervisorEvaluationSummary('${employeeid}', '${currentyear}', '${department}');`;
    }


    mysql.StoredProcedureResult(sql, (err, result) => {
      if (err) console.error(err);

      console.log(`Eval Summary: ${result}`);

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

router.post('/getallcomments', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let accounttype = req.session.accounttype;
    let position = req.body.position;
    let sql = `select 
      tec_allias as allias,
      tgc_comment as goodcomment,
      tnc_comment as needimprovement,
      tec_comment as summarycomment
      from transaction_evaluation_comment
      inner join transaction_good_comment on transaction_evaluation_comment.tec_allias = transaction_good_comment.tgc_allias
      inner join transaction_needimprovement_comment on transaction_good_comment.tgc_allias = transaction_needimprovement_comment.tnc_allias
      where tec_supervisorid='${employeeid}'
      group by tec_allias
      order by tec_allias`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error(err);
      var data = [];
      var index = 1;
      var result_length = result.length;

      console.log(`ALL COMMENTS: ${result} RESULT LENGTH: ${result_length}`);

      if (result_length != 0) {
        result.forEach((key, item) => {
          GetEmployeeName(helper.GenerateNumber(key.allias)).then(employeename => {
            if (accounttype == 'SUPERADMIN') {

              if (position == 'President' || position == 'Department Head') {
                data.push({
                  allias: key.allias,
                  goodcomment: key.goodcomment,
                  needimprovement: key.needimprovement,
                  summarycomment: key.summarycomment,
                })
              }
              else {
                data.push({
                  allias: employeename,
                  goodcomment: key.goodcomment,
                  needimprovement: key.needimprovement,
                  summarycomment: key.summarycomment,
                })
              }
            }
            else {
              data.push({
                allias: key.allias,
                goodcomment: key.goodcomment,
                needimprovement: key.needimprovement,
                summarycomment: key.summarycomment,
              })
            }

            if (index == result_length) {
              res.json({
                msg: 'success',
                data: data
              })
            }

            console.log(`${result_length} ${index}`);
            index += 1;
          });
        })
      }
      else {
        res.json({
          msg: 'success',
          data: data
        })
      }
    })

  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.post('/getquestioncomment', (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let department = req.body.department;
    let accounttype = req.session.accounttype;
    let position = req.body.position;
    let sql = '';

    if (department == 'ADMIN') {
      sql = `select te_alias as allias,
      te_criteria as criteria,
      te_question as question,
      te_comment as comment
      from transaction_evaluation 
      where te_grade in('1','2') 
      and te_subjectid='${employeeid}'
      order by te_criteria`;
    }

    if (department == 'IT' || department == 'CABLING') {
      sql = `select te_alias as allias,
      te_criteria as criteria,
      te_question as question,
      te_comment as comment
      from transaction_evaluation 
      where te_grade in('N','U')
      and te_subjectid='${employeeid}'
      order by te_criteria`;
    }

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error(err);
      var data = [];
      var index = 1;
      var result_length = result.length;

      console.log(`QUESTIONS: ${result_length}`);

      if (result_length != 0) {
        result.forEach((key, item) => {
          GetEmployeeName(helper.GenerateNumber(key.allias)).then(employeename => {
            if (accounttype == 'SUPERADMIN') {
              if (position == 'President' || position == 'Department Head') {
                data.push({
                  allias: key.allias,
                  criteria: key.criteria,
                  question: key.question,
                  comment: key.comment,
                })
              }
              else {
                data.push({
                  allias: employeename,
                  criteria: key.criteria,
                  question: key.question,
                  comment: key.comment,
                })
              }
            }
            else {
              data.push({
                allias: key.allias,
                criteria: key.criteria,
                question: key.question,
                comment: key.comment,
              })
            }

            if (index == result_length) {
              res.json({
                msg: 'success',
                data: data
              })
            }

            console.log(`${result_length} ${index}`);
            index += 1;
          });
        })
      }
      else {
        res.json({
          msg: 'success',
          data: data
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.get('/getactiveparticipant', (req, res) => {
  try {
    let currentyear = helper.GetCurrentYear();
    let sql = `select count(*) totalparticipants from participant_details where pd_year='${currentyear}'`;

    GetActiveCount(sql)
      .then(result => {
        res.json({
          msg: 'success',
          data: result
        })
      }).catch(error => {
        res.json({
          msg: error
        })
      });

  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.get('/getinactiveparticipant', (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let currentyear = helper.GetCurrentYear();
    let employeeCount = `select count(*) totalemployees from master_employee where me_status='${status}'`;
    let participants = `select count(*) totalparticipants from participant_details where pd_year='${currentyear}'`;

    GetEmployeeCount(employeeCount).then(result => {
      var totalemployees = parseFloat(result);
      GetActiveCount(participants).then(result => {
        var activeparticipant = parseFloat(result);
        var total = totalemployees - activeparticipant;
        res.json({
          msg: 'success',
          data: total
        })

      }).catch(error => {
        res.json({
          msg: error
        })
      })
    }).catch(error => {
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

router.get('/getdoneparticipant', (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.D());
    let currentyear = helper.GetCurrentYear();
    let sql = `select count(*) as totalparticipants from participant_details where pd_year='${currentyear}' and pd_status='${status}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error('Error: ', err);

      console.log(result[0].totalparticipants);

      res.json({
        msg: 'success',
        data: result[0].totalparticipants
      })
    })


  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.post('/getinactivenames', (req, res) => {
  try {
    let department = req.body.department;
    let sql = `SELECT concat(me_firstname, ' ', me_middlename, ' ', me_lastname) as fullname
    FROM master_employee
    LEFT JOIN participant_details ON me_employeeid = pd_participantid
    WHERE pd_detailid IS NULL
    AND me_department='${department}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error(err);
      var data = [];

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

router.post('/getrespondents', (req, res) => {
  try {
    let subjectid = req.body.subjectid;
    let status = dictionary.GetValue(dictionary.D());
    let sql_activerepondents = `select count(*) as respondent
      from transaction_participant_subjects as ps
      left join master_supervisor as ms on ps.ps_subjectname = ms.ms_employeeid
      left join master_employee as me on ps.ps_participantid = me.me_employeeid
      where ps_subjectname='${subjectid}'
      and me_department in ('ADMIN','CABLING','IT')
      and ps.ps_status='${status}'
      order by ps_participantid`;

    let sql_totalrespondents = `select count(*) as totalrespondent
      from transaction_participant_subjects as ps
      left join master_supervisor as ms on ps.ps_subjectname = ms.ms_employeeid
      left join master_employee as me on ps.ps_participantid = me.me_employeeid
      where ps_subjectname='${subjectid}'
      and me_department in ('ADMIN','CABLING','IT')
      order by ps_participantid`;

    var data = [];

    console.log(subjectid);

    mysql.SelectResult(sql_activerepondents, (err, result) => {
      if (err) console.error(err);

      console.log(result[0].respondent);

      var respondent = result[0].respondent;
      mysql.SelectResult(sql_totalrespondents, (err, result) => {
        if (err) console.error(err);

        console.log(result[0].totalrespondent);
        var totalrespondents = result[0].totalrespondent;
        data.push(
          respondent,
          totalrespondents
        )

        res.json({
          msg: 'success',
          data: data
        })
      })
    })

  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.post('/loaddoneparticipants', (req, res) => {
  try {
    let year = helper.GetCurrentYear();
    let department = req.body.department;
    let sql = `select 
    pd_participantid as allias,
    pd_status as status
    from participant_details
    inner join transaction_participant_subjects on participant_details.pd_participantid = transaction_participant_subjects.ps_participantid
    inner join master_employee on transaction_participant_subjects.ps_participantid = master_employee.me_employeeid
    where pd_year='${year}'
    and me_department='${department}'
    and pd_status='DONE'
    group by pd_participantid
    order by pd_participantid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.log(err);

      let data = [];

      result.forEach((key, item) => {
        data.push({
          allias: helper.GenerateCode(key.allias),
          status: key.status,
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

function GetActiveCount(cmd) {
  return new Promise((resolve, reject) => {
    mysql.SelectResult(cmd, (err, result) => {
      if (err) reject(err);
      resolve(result[0].totalparticipants);
    })
  })
}

function GetEmployeeCount(cmd) {
  return new Promise((resolve, reject) => {
    mysql.SelectResult(cmd, (err, result) => {
      if (err) reject(err);

      resolve(result[0].totalemployees);
    })
  })
}

function GetSummary(sql) {
  return new Promise((resolve, reject) => {
    mysql.StoredProcedureResult(sql, (err, result) => {
      if (err) reject(err);
      var data = [];
      result.forEach((key, item) => {
        data.push({
          employeeid: key.employeeid,
          employeename: key.employeename,
          E: key.E,
          G: key.G,
          S: key.S,
          N: key.N,
          U: key.U,
          O: key.O,
        })
      })

      resolve(data)
    })
  })
}

function GetEmployeeName(id) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT concat(master_employee.me_firstname,' ', master_employee.me_middlename,' ',master_employee.me_lastname) as employeename FROM evaluation.master_employee where me_employeeid='${id}'`;
    return mysql.SelectResult(sql, (err, result) => {
      if (err) reject(err);

      resolve(result[0].employeename);
    })
  })
}