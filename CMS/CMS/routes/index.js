const express = require('express');
const router = express.Router();
//import routes
const accountSetup = require('./accountSetup');
const commonRoutes = require('./commonRoutes');
const productRoutes = require('./productRoutes');
//We made groupping of routes
//Calling every group of routes from here
accountSetup(router);
commonRoutes(router);
productRoutes(router)

module.exports = router;