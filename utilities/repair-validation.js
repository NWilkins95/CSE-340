// Description: This file contains validation rules for vehicle repair form operations.
const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

/* **********************************
 * Add Repair Form Validation Rules
 * ********************************* */
validate.repairRules = () => {
  return [
    // repair_cost must be a decimal number
    body("repair_cost")
      .trim()
      .notEmpty()
      .withMessage("Repair cost is required.")
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("Repair cost must be a valid number (up to 2 decimal places)."),

    // repair_description must be at least 5 characters
    body("repair_description")
      .trim()
      .notEmpty()
      .withMessage("Repair description is required.")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),

    // repair_date must match YYYY-MM-DD
    body("repair_date")
      .trim()
      .notEmpty()
      .withMessage("Repair date is required.")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Repair date must be in the format YYYY-MM-DD."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add repair
 * ***************************** */
validate.checkRepairData = async (req, res, next) => {
  const { repair_cost, repair_description, repair_date, inv_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("repairs/add-repair", {
      errors,
      title: "Add Repair",
      nav,
      repair_cost,
      repair_description,
      repair_date,
      inv_id, // Ensure inv_id is passed to the view
    })
    return
  }
  next()
}

module.exports = validate