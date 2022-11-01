const jwt = require('jsonwebtoken');
const config = require('config').get('jwtConfig');
const resp = require('../helpers/response');
module.exports = async function(req, res, next){
    // check if there is no token
    if(!req.headers.authorization){
        return resp.cResponse(res,resp.UNAUTHORIZED,'No Token, Authorization denied')
    }
    //get token from header
    let token = req.headers.authorization.split(' ')[1];
    //verify token 
    try{
        const decodedToken = jwt.verify(token, config.jwtKey);
        if(decodedToken.tokenUse!="login"){
            return resp.cResponse(res,resp.UNPROCESSABLE_ENTITY,'Invalid Token');
        }
        req.token = decodedToken;
        next();
    }catch(err){
        return resp.cResponse(res,resp.UNPROCESSABLE_ENTITY,'Invalid Token')
    }
};