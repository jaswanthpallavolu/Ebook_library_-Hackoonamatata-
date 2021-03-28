const jwt = require('jsonwebtoken');

module.exports.verifyAdmin = (req,res,next) => {
    //get authcookie from request
    const authcookie = req.cookies['adm-token']
    //console.log(authcookie);

    if (authcookie == (null ||undefined )) return  res.redirect('/');
    jwt.verify(authcookie, process.env.adm_secret, (err, data) => {
        if (err) {
            // res.sendStatus(403)
            // res.render('login');
            res.data = data;
        }
       
        if(!data.id)  return  res.redirect('/');
        else{
            // console.log(data)
            req.admin = data;
            next()
        }
        
       
    })
}

module.exports.verifyUser = (req,res,next) => {
    //get authcookie from request
    const authcookie = req.cookies['usr-token']
    //console.log(authcookie);

    if (authcookie == null ) return  res.redirect('/');
    jwt.verify(authcookie, process.env.usr_secret, (err, data) => {
        if (err) {
            // res.sendStatus(403)
            // res.render('login');
            res.data = data;
        }
        if(!data.id)  return  res.redirect('/');
        else{
    
            req.user = data; 
            next()
        }
        
    })
}