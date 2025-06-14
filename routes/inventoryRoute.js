// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validate = require("../utilities/inventory-validation")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route to "add classification" view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to "add inventory" view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to handle intentional footer error
router.get("/footer-error", utilities.handleErrors(invController.footerError));

// Route to handle "add classification" form submission
router.post("/add-classification", validate.classificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.processAddClassification));

// Route to handle "add inventory" form submission 
router.post("/add-inventory", validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.processAddInventory));

module.exports = router;