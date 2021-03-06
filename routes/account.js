// routers for managing accounts, login, register, etc

var express = require('express');
var router = express.Router();

var login = require('../controllers/account/login');
var register = require('../controllers/account/register');

// login interface
router.post("/api/login", login.login);
// login page
router.get("/login", login.loginPage);
// register interface
router.post("/api/register", register.register);
// register page
router.get("/register", register.registerPage);
// logout interface
router.get("/api/logout", login.logout);
router.get("/api/getUser", login.getUser);

module.exports = router;
