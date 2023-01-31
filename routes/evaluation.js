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
    let sql = `select te_alias as allias, pd_status as status
    from participant_details PD
    inner join transaction_evaluation PE on pd_participantid = te_participantid
    inner join master_employee on te_participantid = me_employeeid
    where pd_year='${year}'
    and me_department='${department}'
    group by pd_participantid`;

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
    let sql = `call evaluation.GetEvaluationSymmaru('${year}', '${id}', '${department}'); `

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
    let sql = `call evaluation.GetEvaluationSymmaru('${year}', '${id}', '${department}'); `

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
        count(te_grade) as excellentpoints 
        from transaction_evaluation 
        inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
        where te_grade='E'
        and te_year='${year}'
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
        count(te_grade) as excellentpoints 
        from transaction_evaluation 
        inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
        where te_grade='E'
        and te_year='${year}'
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
    let sql = `select distinct te_subjectid as subjectid,
        concat(master_supervisor.ms_lastname) as supervisorname, 
        count(te_grade) as excellentpoints 
        from transaction_evaluation 
        inner join master_supervisor on transaction_evaluation.te_subjectid = master_supervisor.ms_employeeid
        where te_grade='E'
        and te_year='${year}'
        and ms_department='${department}'
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