//#region  MASTERS
exports.MasterEmployee = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            employeeid: key.me_employeeid,
            firstname: key.me_firstname,
            middlename: key.me_middlename,
            lastname: key.me_lastname,
            department: key.me_department,
            position: key.me_position,
            type: key.me_type,
            image: key.me_image,
            status: key.me_status,
            createdby: key.me_createdby,
            createddate: key.me_createddate,
        })
    });

    return dataResult;
}

exports.MasterSupervisor = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            employeeid: key.ms_employeeid,
            firstname: key.ms_firstname,
            middlename: key.ms_middlename,
            lastname: key.ms_lastname,
            department: key.ms_department,
            position: key.ms_position,
            type: key.ms_type,
            image: key.ms_image,
            status: key.ms_status,
            createdby: key.ms_createdby,
            createddate: key.ms_createddate,
        })
    });

    return dataResult;
}

exports.MasterUsers = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            userid: key.mu_userid,
            firstname: key.mu_firstname,
            middlename: key.mu_middlename,
            lastname: key.mu_lastname,
            username: key.mu_username,
            password: key.mu_password,
            type: key.mu_type,
            status: key.mu_status,
            createdby: key.mu_createdby,
            createddate: key.mu_createddate,
        })
    });

    return dataResult;
}

exports.MasterCriteria = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            criteriacode: key.mc_criteriacode,
            criterianame: key.mc_criterianame,
            type: key.mc_type,
            createdby: key.mc_createdby,
            createddate: key.mc_createddate,
        })
    });

    return dataResult;
}

exports.MasterCriteriaQuestions = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            questioncode: key.mcq_questioncode,
            criteria: key.mcq_criteria,
            subcriteria: key.mcq_subcriteria,
            type: key.mcq_type,
            question: key.mcq_question,
            createdby: key.mcq_createdby,
            createddate: key.mcq_createddate,
        })
    });

    return dataResult;
}

exports.MasterDepartment = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            departmentcode: key.md_departmentcode,
            department: key.md_department,
            createdby: key.md_createdby,
            creadteddate: key.md_creadteddate,
        })
    });

    return dataResult;
}

exports.MasterPosition = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            positioncode: key.mp_positioncode,
            position: key.mp_position,
            department: key.mp_department,
            createdby: key.mp_createdby,
            creadteddate: key.mp_createddate,
        })
    });

    return dataResult;
}

exports.MasterSubject = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            subjectcode: key.ms_subjectcode,
            subject: key.ms_subject,
            createdby: key.ms_createdby,
            createddate: key.ms_createddate,
        })
    });

    return dataResult;
}

exports.MasterSubcriteria = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            subcriteriacode: key.ms_subcriteriacode,
            criteria: key.ms_criteria,
            subcriteria: key.ms_subcriteria,
            createdby: key.ms_createdby,
            createddate: key.ms_createddate,
        })
    });

    return dataResult;
}

//#endregion

//#region TRANSACTIONS
exports.TransactionEvaluation = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            transactionid: key.te_transactionid,
            year: key.te_year,
            participantid: key.te_participantid,
            subjectid: key.te_subjectid,
            alias: key.te_alias,
            criteria: key.te_criteria,
            question: key.te_question,
            grade: key.te_grade,
            comment: key.te_comment,
            status: key.te_status,
        })
    });

    return dataResult;
}

exports.ParticipantDetails = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            detailid: key.pd_detailid,
            participantid: key.pd_participantid,
            year: key.pd_year,
            details: key.pd_details,
            status: key.pd_status,
            createdby: key.pd_createdby,
            createddate: key.pd_createddate,
        })
    });

    return dataResult;
}

exports.TransactionParticipantSubject = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            transactionid: key.ps_transactionid,
            detailid: key.ps_detailid,
            participantid: key.ps_participantid,
            year: key.ps_year,
            subjectname: key.ps_subjectname,
            type: key.ps_type,
            status: key.ps_status,
            createdby: key.ps_createdby,
            createddate: key.ps_createddate,
        })
    });

    return dataResult;
}

exports.TransactionEvaluationComment = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            transactionid: key.tec_transactiodid,
            year: key.tec_year,
            supervisorid: key.tec_supervisorid,
            allias: key.tec_allias,
            comment: key.tec_comment,
            status: key.tec_status,
        })
    });

    return dataResult;
}

exports.TransactionNeedImprovementComment = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            transactionid: key.tnc_transactionid,
            year: key.tnc_year,
            employeeid: key.tnc_employeeid,
            allias: key.tnc_allias,
            comment: key.tnc_comment,
            commentdate: key.tnc_commentdate,
        })
    });

    return dataResult;
}

exports.TransactionGoodComment = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            transactionid: key.tgc_transactionid,
            year: key.tgc_year,
            employeeid: key.tgc_employeeid,
            allias: key.tgc_allias,
            comment: key.tgc_comment,
            commentdate: key.tgc_commentdate,
        })
    });

    return dataResult;
}

exports.MasterAccesstype = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            accesscode: key.ma_accesscode,
            accesstype: key.ma_accesstype,
            createdby: key.ma_createdby,
            createddate: key.ma_createddate,
        })
    });

    return dataResult;
}
//#endregion
