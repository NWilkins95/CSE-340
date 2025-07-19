// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validateAccount = require ("../utilities/account-validation")
const validate = require("../utilities/repair-validation")
const repairsController = require("../controllers/repairsController")

// Route to build view of all repairs for a specific inventory item
router.get("/view-repair/:inv_id", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.buildRepairsByInventoryId));

// Route to build adding a repair view
router.get("/add-repair/:inv_id", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.buildAddRepair));

// Route to handle adding a repair
router.post("/add-repair", utilities.checkLogin, validateAccount.checkAdminAccess, validate.repairRules(), validate.checkRepairData, utilities.handleErrors(repairsController.addRepair));

// Export the router
module.exports = router;