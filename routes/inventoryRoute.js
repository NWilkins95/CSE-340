// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const validate = require("../utilities/inventory-validation")
const accountValidate = require("../utilities/account-validation")
const invController = require("../controllers/invController")

// Route to build management view
router.get("/", accountValidate.checkAdminAccess, utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Route to "add classification" view
router.get("/add-classification", accountValidate.checkAdminAccess, utilities.handleErrors(invController.buildAddClassificationView));

// Route to "add inventory" view
router.get("/add-inventory", accountValidate.checkAdminAccess, utilities.handleErrors(invController.buildAddInventoryView));

// Route to handle intentional footer error
router.get("/footer-error", utilities.handleErrors(invController.footerError));

// Route to get inventory items based on classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inv_id", accountValidate.checkAdminAccess, utilities.handleErrors(invController.editInventoryView));

// Route to build the delete inventory view
router.get("/delete/:inv_id", accountValidate.checkAdminAccess, utilities.handleErrors(invController.deleteInventoryView));

// Route to handle "add classification" form submission
router.post("/add-classification", validate.classificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.processAddClassification));

// Route to handle "add inventory" form submission 
router.post("/add-inventory", validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.processAddInventory));

// Route to handle "edit inventory" form submission
router.post("/update/", validate.addInventoryRules(), validate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Route to handle "delete inventory" form submission
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;