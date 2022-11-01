const jwtConfig = require("config").get("jwtConfig");
const app = require("config");
const bcrypt = require("bcryptjs");
const {nanoid} = require('nanoid');
const resp = require('../../helpers/response');
const accountSetupServices = require('../../services/AccountSetup');
const commonServices = require('../../services/Common');
const common = require('../../helpers/common');
const accountSetup = {
    //User registration
    register : async (req, res) => {
     try {
      const userId = nanoid(25);
      const body = req.body;
      

      const userInfo = {
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
        user_type: 'user',
        status: 'active',
        email_verification:'verified',
        password: body.password,
    }
       //check user Email
       const check = await commonServices.readSingleData('users','email',{email: body.email});
       if (check.length != 0) {
         return resp.cResponse(res,resp.NOT_FOUND,'User with email already exist.');
       }
       //Create hash for password
       const salt = await bcrypt.genSalt(10);
       body.password = await bcrypt.hash(body.password, salt);
       userInfo.password = body.password;
       //Insertion
       let result = await commonServices.dynamicInsert('users',userInfo);
       if(result.affectedRows < 1){
         return resp.cResponse(res,resp.BAD_REQUEST,'Something went wrong');
       }
       //Create JWT Tokens
       const tempData = {
         userId: userId,
         userName:body.name,
         email: body.email
       };
       let token = common.createToken(
         tempData,
         jwtConfig.jwtExpirySeconds,
         "login"
       );
       //creating refresh token
       let refreshToken = common.createToken(
         tempData,
         jwtConfig.refreshTokenExpiry,
         "login"
       );
       return resp.cResponse(res,resp.CREATED,'Registration successfull',{token : token,refreshToken : refreshToken});
     } catch (error) {
      return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
     }
   },
   //Login
   login: async(req, res) => {
    try{
        let body = req.body;
        //Match user details
        let loginResults = await commonServices.readSingleData('users','*',{email : body.email});
        if(loginResults.length > 0){
          const match = await bcrypt.compare(body.password,loginResults[0].password);
          if(match == false){
            return resp.cResponse(res,resp.UNAUTHORIZED,'Invalid credentials');
          }
        }else{
          return resp.cResponse(res,resp.NOT_FOUND,'User with email does not exist');
        }
        //Prepare data from JWT tokens
        const tempData = {
          userId : loginResults[0].id,
          name : loginResults[0].name,
          email : loginResults[0].email,
          userType : loginResults[0].user_type
        }
        //Creating JWT tokens
        let token = common.createToken(tempData,jwtConfig.jwtExpirySeconds,"login");
        let refreshToken = common.createToken(tempData,jwtConfig.refreshTokenExpiry,"login");
        return resp.cResponse(res,resp.SUCCESS,"Login successfull", {token : token, refreshToken : refreshToken});
    }
    catch(error){
      return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
    }
},
}


module.exports = accountSetup;

 
