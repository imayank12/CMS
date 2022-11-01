const accountSetup = require("../api/controllers/accountSetup");
const { check } = require("express-validator");
const reqValidator = require('../middleware/reqValidator');
module.exports = (router) => {
  //User registration
  router.post(
    "/registration",
    [
      check("name", "Please enter Name")
        .exists()
        .isLength({
          min: 3,
          max: 50,
        })
        .withMessage("Name should contain atleast 3 and atmost 50 characters")
        .matches(/^[a-zA-Z ]*$/)
        .withMessage("Name should contain only alphabets"),
      check("email", "Please enter valid Email").exists().isEmail(),
      check("phone", "Please enter phone number")
        .exists()
        .isMobilePhone()
        .withMessage("Please enter valid mobile number")
        .isLength({
          min: 10,
          max: 10,
        })
        .withMessage("Phone Number should have length equal to 10"),
      check('password','Please enter password').exists()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/)
        .withMessage('Password must be Minimum 8 & maximum 20 characters, at least one letter, one number and one special character'),
        check('confirmPassword').exists('Please enter confirm password.')
          .custom((val,{req}) =>{
          if(val !== req.body.password){
              throw new Error('Password Confirmation does not match password')
          }
          return true;
      })
    ],
    reqValidator,
    accountSetup.register
  );
  //login
  router.post(
    "/login",
    [
      check("email", "Please enter email")
        .exists({checkFalsy : true})
        .isEmail()
        .withMessage("Please enter valid email."),
      check('password','Please enter password')
        .exists()
    ],
    reqValidator,
    accountSetup.login
  );
}