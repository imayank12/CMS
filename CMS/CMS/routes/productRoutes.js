const productController = require("../api/controllers/productController");
const auth = require('../middleware/auth');
const resp = require('../helpers/response');
const { check } = require("express-validator");
const reqValidator = require('../middleware/reqValidator');


// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads');
//     },
//     filename: function(req, file, cb) {
//       cb(null, new Date().toISOString() + file.originalname);
//     }
//   });

// const uploadSingleFile = multer({storage:storage});
const multer = require('multer')
const uploadSingleFile = multer({dest:'uploads/'}).single('file');

module.exports = (router) => {
    router.post('/addProduct',auth,function (req, res) {
        uploadSingleFile(req, res, function (err) {
            if(err && err.code=='LIMIT_UNEXPECTED_FILE'){
                // An error occurred when uploading
                return resp.cResponse(res,resp.PRECONDITION_FAILED,"Please provide file to upload");
            }
            // Everything went fine
            productController.addProduct(req, res);
        })
    });

    router.put('/editProduct',auth,function (req, res) {
        uploadSingleFile(req, res, function (err) {
            if(err && err.code=='LIMIT_UNEXPECTED_FILE'){
                // An error occurred when uploading
                return resp.cResponse(res,resp.PRECONDITION_FAILED,"Please provide file to upload");
            }
            // Everything went fine
            productController.editProduct(req, res);
        })
    });

    router.post(
        "/getProduct",
        [
            check('id').optional({checkFalsy:true}).isInt({min:1}).isInt({min:1}).withMessage("Invalid Id"),
        ],
        reqValidator,
        productController.getProduct
      );
      router.post(
        "/deleteProduct",
        [
            check('id').optional({checkFalsy:true}).isInt({min:1}).isInt({min:1}).withMessage("Invalid Id"),
        ],
        reqValidator,
        productController.deleteProduct
      );  
}

