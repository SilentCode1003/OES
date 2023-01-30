const mysql = require('mysql');
const model = require('../model/model');
require('dotenv').config();
const crypt = require('./crytography');

let password = '';
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
    if (err) throw err;

    password = result;
    // console.log(`${result}`);
});


const connection = mysql.createConnection({
    host: process.env._HOST,
    user: process.env._USER,
    password: password,
    database: process.env._DATABASE
});


exports.InsertMultiple = async (stmt, todos) => {
    try {
        connection.connect((err) => { return err; })
        // console.log(`statement: ${stmt} data: ${todos}`);

        connection.query(stmt, [todos], (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row inserted: ${results.affectedRows}`);

            return 1;
        });

    } catch (error) {
        console.log(error);
    }
}

exports.Select = (sql, table, callback) => {
    try {
        connection.connect((err) => { return err; })
        connection.query(sql, (error, results, fields) => {

            // console.log(results);

            if (error) {
                callback(error, null)
            }

            if (table == 'MasterEmployee') {
                callback(null, model.MasterEmployee(results));
            }

            if (table == 'MasterSupervisor') {
                callback(null, model.MasterSupervisor(results));
            }

            if (table == 'MasterUsers') {
                callback(null, model.MasterUsers(results));
            }

            if (table == 'MasterCriteria') {
                callback(null, model.MasterCriteria(results));
            }

            if (table == 'MasterCriteriaQuestions') {
                callback(null, model.MasterCriteriaQuestions(results));
            }

            if (table == 'EvaluationDetails') {
                callback(null, model.EvaluationDetails(results));
            }

            if (table == 'TransactionEvaluation') {
                callback(null, model.TransactionEvaluation(results));
            }

            if (table == 'ParticipantDetails') {
                callback(null, model.ParticipantDetails(results));
            }

            if (table == 'TransactionParticipantSubject') {
                callback(null, model.TransactionParticipantSubject(results));
            }

            if (table == 'TransactionEvaluationComment') {
                callback(null, model.TransactionEvaluationComment(results));
            }
        });

    } catch (error) {
        console.log(error);
    }
}

exports.StoredProcedure = (sql, data, callback) => {
    try {

        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                callback(error.message, null);
            }
            callback(null, results[0])
        });
    } catch (error) {
        callback(error, null);
    }
}

exports.StoredProcedureResult = (sql, callback) => {
    try {

        connection.query(sql, (error, results, fields) => {
            if (error) {
                callback(error.message, null);
            }
            callback(null, results[0])
        });
    } catch (error) {
        callback(error, null);
    }
}

exports.Update = async (sql, callback) => {
    try {
        connection.query(sql, (error, results, fields) => {
            if (error) {
                callback(error, null)
            }
            // console.log('Rows affected:', results.affectedRows);

            callback(null, `Rows affected: ${results.affectedRows}`);
        });
    } catch (error) {
        callback(error, null)
    }
}

exports.UpdateMultiple = async (sql, data, callback) => {
    try {
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                callback(error, null)
            }
            // console.log('Rows affected:', results.affectedRows);

            callback(null, `Rows affected: ${results.affectedRows}`);
        });
    } catch (error) {
        console.log(error);
    }
}

exports.CloseConnect = () => {
    connection.end();
}

exports.Insert = (stmt, todos, callback) => {
    try {
        connection.connect((err) => { return err; })
        // console.log(`statement: ${stmt} data: ${todos}`);

        connection.query(stmt, [todos], (err, results, fields) => {
            if (err) {
                callback(err, null);
            }
            callback(null, `Row inserted: ${results.affectedRows}`);
            // console.log(`Row inserted: ${results.affectedRows}`);
        });

    } catch (error) {
        callback(error, null);
    }
}

exports.SelectResult = (sql, callback) => {
    try {
        connection.connect((err) => { return err; })
        connection.query(sql, (error, results, fields) => {

            // console.log(results);

            if (error) {
                callback(error, null)
            }

            callback(null, results);

        });

    } catch (error) {
        console.log(error);
    }
}

exports.InsertTable = (tablename, data, callback) => {
    if (tablename == 'master_employee') {
        let sql = `INSERT INTO master_employee(
            me_employeeid,
            me_firstname,
            me_middlename,
            me_lastname,
            me_department,
            me_image,
            me_status,
            me_createdby,
            me_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_supervisor') {
        let sql = `INSERT INTO master_supervisor(
                ms_employeeid,
                ms_firstname,
                ms_middlename,
                ms_lastname,
                ms_department,
                ms_image,
                ms_status,
                ms_createdby,
                ms_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_users') {
        let sql = `INSERT INTO master_users(
            mu_firstname,
            mu_middlename,
            mu_lastname,
            mu_username,
            mu_password,
            mu_type,
            mu_status,
            mu_createdby,
            mu_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_criteria') {
        let sql = `INSERT INTO master_criteria(
            mc_criterianame,
            mc_createdby,
            mc_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'master_criteria_questions') {
        let sql = `INSERT INTO master_criteria_questions(
            mcq_criteria,
            mcq_question,
            mcq_createdby,
            mcq_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'transaction_evaluation') {
        let sql = `INSERT INTO transaction_evaluation(
            te_year,
            te_participantid,
            te_subjectid,
            te_alias,
            te_criteria,
            te_question,
            te_grade,
            te_status) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'participant_details') {
        let sql = `INSERT INTO participant_details(
            pd_participantid,
            pd_year,
            pd_details,
            pd_status,
            pd_createdby,
            pd_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'transaction_participant_subjects') {
        let sql = `INSERT INTO transaction_participant_subjects(
            ps_detailid,
            ps_participantid,
            ps_year,
            ps_subjectname,
            ps_status,
            ps_createdby,
            ps_createddate) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }

    if (tablename == 'transaction_evaluation_comment') {
        let sql = `INSERT INTO transaction_evaluation_comment(
            tec_year,
            tec_supervisorid,
            tec_allias,
            tec_comment,
            tec_status) VALUES ?`;

        this.Insert(sql, data, (err, result) => {
            if (err) {
                callback(err, null);
            }
            callback(null, result)
        })
    }
}