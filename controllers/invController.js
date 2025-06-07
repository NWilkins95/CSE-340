const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inv_id
  const data = await invModel.getInventoryById(inventory_id)
  const vehicle = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    vehicle,
    errors: null,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build "add classification" view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build "add inventory" view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  const classifications = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classifications,
    errors: null,
  })
}

/* ***************************
 *  Handle intentional footer error
 * ************************** */
invCont.footerError = (req, res, next) => {
  const err = new Error("Intentional footer error")
  err.status = 500
  throw err
}

module.exports = invCont