// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validateAccount = require ("../utilities/account-validation")
const repairsController = require("../controllers/repairsController")

// Route to build view of all repairs for a specific inventory item
router.get("/view/:inv_id", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.buildRepairsByInventoryId));

// Route to build adding a repair view
router.get("/add", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.buildAddRepair));

// Route to handle adding a repair
router.post("/add", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.addRepair)); // come back and add validation