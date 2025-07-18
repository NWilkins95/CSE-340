const utilities = require("../utilities/")
const repairsModel = require("../models/repair-model.js")
const repairsController = {}

/* ***************************
 *  Build add repair view
 * ************************** */
repairsController.buildAddRepair = async function (req, res, next) {
    const nav = await utilities.getNav()
    const inv_id = req.params.inv_id
    res.render("repairs/add-repair", { 
        nav: nav,
        title: "Add Repair", 
        inv_id: inv_id, 
        errors: null,
    })
}

/* ***************************
 *  Build repairs by inventory ID view
 * ************************** */
repairsController.buildRepairsByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await repairsModel.getRepairsByInventoryId(inv_id)
    if (data.length === 0) {
        req.flash("notice", "No repairs found for this inventory item.")
        return res.redirect("/inv/")
    }
    const repairList = await utilities.buildRepairList(data)
    console.log("repairList:", repairList)
    const nav = await utilities.getNav()
    res.render("repairs/repairs", {
        title: "View Repairs",
        nav: nav,
        repairList: repairList,
        errors: null,
    })
}

module.exports = repairsController