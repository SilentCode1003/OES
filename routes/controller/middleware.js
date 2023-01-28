const isLogin = (req, res, next) => {

    console.log(`Access Type: ${req.session.accounttype}`);
    if (req.session.isAuth && req.session.accounttype == "ADMINISTRATOR") {
        next();
    }
    if (req.session.isAuth && req.session.accounttype == "USER") {
        res.redirect('/introduction');
    }

    else {
        res.redirect('/');
    }
};

module.exports = { isLogin }