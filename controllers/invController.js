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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
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
 *  Process adding a classification
 * ************************** */
invCont.processAddClassification = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.insertClassification(classification_name)
  if (result) {
    req.flash("notice", `Classification ${classification_name}  added successfully.`)
    res.status(201).redirect("/inv/management")
  } else {
    req.flash("notice", `Error adding classification ${classification_name}. Please try again.`)
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    })
  }
}

/* ***************************
 *  Process adding a vehicle
 * ************************** */
invCont.processAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
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

  const result = await invModel.insertInventory({
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

  if (result) {
    req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully.`)
    res.status(201).redirect("/inv/management")
  } else {
    req.flash("notice", `Error adding vehicle ${inv_make} ${inv_model}. Please try again.`)
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
      classifications: await utilities.buildClassificationList(),
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
  }
}

/* ***************************
 *  Handle intentional footer error
 * ************************** */
invCont.footerError = (req, res, next) => {
  const err = new Error("Intentional footer error")
  err.status = 500
  throw err
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont