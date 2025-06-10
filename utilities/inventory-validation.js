// Description: This file contains validation rules for inventory-related operations.
const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const path = require("path")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Validation Rules
 * ********************************* */

validate.classificationRules = () => {
    return [
        // classification_name is required, must be a string, and can't already be in the database
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a classification name.")
            .custom(async (classification_name) => {
                const exists = await inventoryModel.classificationExists(classification_name)
                if (exists) {
                    throw new Error("Classification already exists. Please use a different name.")
                }
                if (!classification_name.match(/^[a-zA-Z]+$/)) {
                    throw new Error("Classification name can only contain alphabetical characters.")
                }
            }),
    ]
}

/* **********************************
 * "Add Inventory" Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
    return [
        // classification_id is required and must be numeric
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please select a classification."),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a make for the vehicle."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a model for the vehicle."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a description for the vehicle."),
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid image file path."),
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid thumbnail file path."),
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .custom(async (inv_price) => {
                if (!inv_price.match(/^\d+(\.\d{1,2})?$/)) {
                    throw new Error("Only numeric values are allowed for price.")
                }
            })
            .withMessage("Please provide a valid price for the vehicle."),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .custom(async (inv_year) => {
                if (!inv_year.match(/^\d{4}$/)) {
                    throw new Error("Year must be a four-digit number.")
                }
            })
            .withMessage("Please provide a valid year for the vehicle."),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .custom(async (inv_miles) => {
                if (!inv_miles.match(/^\d+$/)) {
                    throw new Error("Miles must be a whole number numeric value.")
                }
            })
            .withMessage("Please provide valid mileage for the vehicle."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a color for the vehicle."),
    ]
}

/* **********************************
 * Validate Classification Data
 * ********************************* */

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* **********************************
 * Validate "Add Inventory" Data
 * ********************************* */
validate.checkAddInventoryData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let classifications = await utilities.buildClassificationList()
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classifications,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}


module.exports = validate