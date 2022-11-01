const resp = require('../helpers/response');
const {validationResult} = require('express-validator');
const common = require('../helpers/common');
module.exports = async(req,res,next) => {
    //validating request parameters
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
      return resp.cResponse(res,resp.PRECONDITION_FAILED,errors);
    }
     req.body = common.trimBody(req.body);
    next();
}