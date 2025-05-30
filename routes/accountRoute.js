// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validate = require ("../utilities/account-validation")
const accountController = require("../controllers/accountController")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle registration form submission
router.post('/register', validate.registationRules(), validate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login", validate.loginRules(), validate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;