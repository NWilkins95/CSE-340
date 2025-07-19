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
    console.log("data:", data)
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

/* ***************************
 *  Add a repair to the database
 * ************************** */
repairsController.addRepair = async function (req, res, next) {
    const inv_id = req.body.inv_id
    const repair_cost = parseFloat(req.body.repair_cost)
    const repair_description = req.body.repair_description
    const repair_date = req.body.repair_date
    const result = await repairsModel.addRepair(inv_id, repair_description, repair_cost, repair_date)
    if (result) {
        req.flash("notice", "Repair added successfully.")
        res.redirect(`/repairs/view-repair/${inv_id}`)
    } else {
        req.flash("notice", "An error occurred while adding the repair.")
        res.redirect(`/repairs/add-repair/${inv_id}`)
    }       
}


module.exports = repairsController