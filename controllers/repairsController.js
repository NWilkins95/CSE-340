const utilities = require("../utilities/")
const repairsModel = require("../models/repair-model.js")
const repairsController = {}

/* ***************************
 *  Build add repair view
 * ************************** */
repairsController.buildAddRepair = async (req, res, next) => {
  let nav = await utilities.getNav()
  let inventory = await repairsModel.getAllRepairs()
  res.render("repairs/add-repair", {
    title: "Add Repair",
    nav,
    inventory,
    errors: null,
  })
}

module.exports = repairsController