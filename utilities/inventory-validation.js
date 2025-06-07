// Description: This file contains validation rules for inventory-related operations.
const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
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


module.exports = validate