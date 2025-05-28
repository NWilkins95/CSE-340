// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accController = require("../controllers/invController")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;