// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validateAccount = require ("../utilities/account-validation")
const repairsController = require("../controllers/repairsController")

// Route to build view of all repairs for a specific inventory item
router.get("/view-repair/:inv_id", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.buildRepairsByInventoryId));

// Route to build adding a repair view
console.log("handleErrors result:", typeof utilities.handleErrors(repairsController.buildAddRepair));
router.get("/add-repair/:inv_id", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.buildAddRepair));

// Route to handle adding a repair
router.post("/add-repair", utilities.checkLogin, validateAccount.checkAdminAccess, utilities.handleErrors(repairsController.addRepair)); // come back and add validation

// Export the router
module.exports = router;