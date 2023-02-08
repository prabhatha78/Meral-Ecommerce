const verifyUser = (req, res, next) => {
    console.log(req.session);
    if (req.session.userloggedIn) {
        next()
    } else {
        res.redirect('/login');
    }
}


module.exports=verifyUser;