// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validate = require ("../utilities/account-validation")
const accountController = require("../controllers/accountController")

// Route to buuild account managqement view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to handle logout
router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.accountLogout));

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build update view
router.get("/update", utilities.checkJWTToken, utilities.handleErrors(accountController.buildUpdate));

// Route to handle account update form submission
router.post("/update", utilities.checkJWTToken, validate.updateRules(), validate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

// Route to handle password update form submission
router.post("/update-password", utilities.checkJWTToken, validate.updatePasswordRules(), validate.checkUpdatePasswordData, utilities.handleErrors(accountController.updatePassword))

// Route to handle registration form submission
router.post('/register', validate.registationRules(), validate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login", validate.loginRules(), validate.checkLoginData, utilities.handleErrors(accountController.accountLogin));

module.exports = router;