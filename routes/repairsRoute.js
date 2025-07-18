// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const repairsController = require("../controllers/repairsController")

// Route to build repairs view
router.get("/", utilities.checkLogin, utilities.handleErrors(repairsController.buildRepairs));

// Route to build adding a repair view
router.get("/add", utilities.checkLogin, utilities.handleErrors(repairsController.buildAddRepair));

// Route to build deleting a repair view
router.get("/delete", utilities.checkLogin, utilities.handleErrors(repairsController.buildDeleteRepair));

// Route to handle adding a repair
router.post("/add", utilities.checkLogin, utilities.handleErrors(repairsController.addRepair)); // come back and add validation

// Route to handle deleting a repair
router.post("/delete", utilities.checkLogin, utilities.handleErrors(repairsController.deleteRepair)); // come back and add validation