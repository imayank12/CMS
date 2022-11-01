const commonController = require("../api/controllers/commonController");
const auth = require('../middleware/auth');
const resp = require('../helpers/response');
const multer = require('multer');
const uploadSingleFile = multer({dest:'uploads/'}).single('file');
module.exports = (router) => {
    router.post('/uploadFile',auth,function (req, res) {
        uploadSingleFile(req, res, function (err) {
            if(err && err.code=='LIMIT_UNEXPECTED_FILE'){
                // An error occurred when uploading
                return resp.cResponse(res,resp.PRECONDITION_FAILED,"Please provide file to upload");
            }
            // Everything went fine
            commonController.uploadfile(req, res);
        })
    });
}