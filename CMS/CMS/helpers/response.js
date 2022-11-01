const statusCode = require('./statusCodes');
const logger = require('../logger/index');
module.exports = class Helper extends statusCode {
    static cResponse(res, status, info, data = null, ) {
        //Generating custom error messages for logger
        if(info.stack){
            let customMsg;
            if(info.errorMessage){
                let errorLocation = info.stack.split('\n')[3];
                customMsg = `${info.errorMessage} ${errorLocation}`;
            }else{
                let errorLocation = info.stack.split('\n')[1];
                customMsg = `${info.message} ${errorLocation}`;
                info = info.message;
            }
            logger.info(customMsg);
        }
        if (data == null) {
            res.status(status).json({status : status, message : info});
        } else {
            res.status(status).json({status : status, message : info, data : data});
        }
    }

};