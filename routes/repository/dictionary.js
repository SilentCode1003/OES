
exports.GetValue = (abr) => {
    if (abr == 'WH') return 'WAREHOUSE';
    if (abr == 'DLV') return 'TO BE DELIVER TO CLIENT';
    if (abr == 'NPD') return 'NOT PAID';
    if (abr == 'SLD') return 'SOLD';
    if (abr == 'PIC') return 'FOR PICKUP TO WAREHOUSE';
    if (abr == 'PD') return 'PAID';
    if (abr == 'NSTK') return 'NO STOCKS AVAILABLE';
    if (abr == 'REQ') return 'REQUEST';
    if (abr == 'PND') return 'PENDING';
    if (abr == 'APD') return 'APPROVED';
    if (abr == 'ALLOC') return 'ALLOCATE SERIALS';
    if (abr == 'ALLOCP') return 'ALLOCATE PRICE';
    if (abr == 'REQB') return 'REQUEST BUDGET';
    if (abr == 'WAIT') return 'WAITING';
    if (abr == 'RES') return 'RESTOCK';
    if (abr == 'FAPR') return 'FOR APPROVAL';
    if (abr == 'SPR') return 'SPARE';
    if (abr == 'DLY') return 'DEPLOYED';
    if (abr == 'RET') return 'RETURNED';
    if (abr == 'ACT') return 'ACTIVE';
    if (abr == 'REM') return 'REMOVE';
    if (abr == 'UPD') return 'UPDATE';
    if (abr == 'INST') return 'INST';
    if (abr == 'RSGD') return 'RESIGNED';
    if (abr == 'RGLR') return 'REGULAR';
    if (abr == 'ADMIN') return 'ADMIN';
    if (abr == 'IT') return 'IT';
    if (abr == 'CABLING') return 'CABLING';
    if (abr == 'D') return 'DONE';
}

//#region STATUS CODE
exports.WH = () => {
    return 'WH';
}

exports.DLV = () => {
    return 'DLV';
}

exports.NPD = () => {
    return 'NPD';
}

exports.SLD = () => {
    return 'SLD';
}

exports.PIC = () => {
    return 'PIC';
}

exports.PD = () => {
    return 'PD';
}

exports.NSTK = () => {
    return 'NSTK';
}

exports.REQ = () => {
    return 'REQ';
}

exports.PND = () => {
    return 'PND';
}

exports.APD = () => {
    return 'APD';
}

exports.ALLOC = () => {
    return 'ALLOC';
}

exports.REQB = () => {
    return 'REQB';
}

exports.WAIT = () => {
    return 'WAIT';
}

exports.ALLOCP = () => {
    return 'ALLOCP';
}

exports.RES = () => {
    return 'RES';
}

exports.FAPR = () => {
    return 'FAPR';
}

exports.SPR = () => {
    return 'SPR';
}

exports.DLY = () => {
    return 'DLY';
}

exports.RET = () => {
    return 'RET';
}

exports.ACT = () => {
    return 'ACT';
}

exports.REM = () => {
    return 'REM';
}

exports.UPD = () => {
    return 'UPD';
}

exports.INST = () => {
    return 'INST';
}

exports.RSGD = () => {
    return 'RSGD';
}

exports.RGLR = () => {
    return 'RGLR';
}

exports.ADMIN = () => {
    return 'ADMIN';
}

exports.IT = () => {
    return 'IT';
}

exports.CABLING = () => {
    return 'CABLING';
}

exports.D = () => {
    return 'D';
}


//#endregion

//#region 
exports.GetHex = (string) => {
    if (string == '1') {
        return 'A';
    }
    if (string == '2') {
        return 'S';
    }
    if (string == '3') {
        return 'E';
    }
    if (string == '4') {
        return 'P';
    }
    if (string == '5') {
        return 'I';
    }
    if (string == '6') {
        return 'T';
    }
    if (string == '7') {
        return 'O';
    }
    if (string == '8') {
        return 'N';
    }
    if (string == '9') {
        return 'U';
    }
    if (string == '0') {
        return 'L';
    }
}

exports.ReverseHex = (string) => {
    if (string == 'A') {
        return '1';
    }
    if (string == 'S') {
        return '2';
    }
    if (string == 'E') {
        return '3';
    }
    if (string == 'P') {
        return '4';
    }
    if (string == 'I') {
        return '5';
    }
    if (string == 'T') {
        return '6';
    }
    if (string == 'O') {
        return '7';
    }
    if (string == 'N') {
        return '8';
    }
    if (string == 'U') {
        return '9';
    }
    if (string == 'L') {
        return '0';
    }
}
//#endregion