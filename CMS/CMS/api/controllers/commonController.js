
const resp = require('../../helpers/response');
const fs = require('fs');
const commonController = {
    uploadfile : async(req, res) =>{
        let file =req.file;
        let token = req.token;
        if(!file){
            return resp.cResponse(res,resp.PRECONDITION_FAILED,"Please provide file");
        }
        try{
            let dirName = `testUploads/${token.userId}`;
            let result = await s3Helper.uploadFileToS3(file,dirName);
            return resp.cResponse(res,resp.SUCCESS,"File uploaded successfully.",result);
        }catch(error){
            return resp.cResponse(res,resp.EXPECTATION_FAILED,error);
        }finally{
            fs.unlinkSync(`./${file.destination}${file.filename}`);
        }
    }
}

module.exports = commonController;