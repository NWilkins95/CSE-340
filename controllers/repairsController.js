const utilities = require("../utilities/")
const repairsModel = require("../models/repair-model.js")
const repairsController = {}

/* ***************************
 *  Build add repair view
 * ************************** */
repairsController.buildAddRepair = async (req, res) => {
  const inv_id = req.params.inv_id
  const inventoryItem = await repairsModel.getRepairsByInventoryId(inv_id)
  if (!inventoryItem || inventoryItem.length === 0) {
    return res.status(404).send("Inventory item not found")
  }
  res.render("repairs/add-repair", { title: "Add Repair", inv_id: inv_id })
}


module.exports = repairsController