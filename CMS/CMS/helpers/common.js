const jwt = require("jsonwebtoken");
const jwtConfig = require("config").get("jwtConfig");
const commonServices = require('../services/Common');
const common = {
    trimBody : (body) => {
        for(var all in body){
            if(typeof body[all] !== 'number' && typeof body[all] !== 'object' && typeof body[all] !== 'boolean'){
                body[all] = body[all].trim();
            }
        }
        return body;
    },
    createToken : (userData, tokenTime, tokenUse="login") => {
        console.log(userData)
        let tempData = {
            userId : userData.userId,
            username:userData.name,
            email : userData.email,
            userType:userData.userType,
            tokenUse : tokenUse
        };
        return jwt.sign(tempData,jwtConfig.jwtKey, {
            algorithm : jwtConfig.algorithm,
            expiresIn : tokenTime
        })
    }
}
module.exports = common;