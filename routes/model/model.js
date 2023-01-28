exports.MasterEmployee = (data) => {
    let dataResult = [];

    data.forEach((key, item) => {

        dataResult.push({
            employeeid: key.me_employeeid,
            firstname: key.me_firstname,
            middlename: key.me_middlename,
            lastname: key.me_lastname,
            department: key.me_department,
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
            question: key.mcq_question,
            createdby: key.mcq_createdby,
            createddate: key.mcq_createddate,
        })
    });

    return dataResult;
}

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
            status: key.ps_status,
            createdby: key.ps_createdby,
            createddate: key.ps_createddate,
        })
    });

    return dataResult;
}