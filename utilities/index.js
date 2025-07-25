const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build the inventory detail view HTML
 * **************************************** */
Util.buildInventoryDetail = async function(data){
  let vehicle = '<div id="inv-detail">'
  vehicle += '<div class="detail-image">'
  vehicle += '<img src="' + data.inv_image + '" alt="Image of ' 
  + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" >'
  vehicle += '</div>'
  vehicle += '<div class="detail-info">'
  vehicle += '<h3>' + data.inv_make + ' ' + data.inv_model + ' ' +  'Details</h3>'
  vehicle += '<p class="detail-price detail-item"><strong>Price:</strong> $' 
  + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
  vehicle += '<p class="detail-color detail-item"><strong>Color:</strong> ' + data.inv_color + '</p>'
  vehicle += '<p class="detail-mileage detail-item"><strong>Mileage:</strong> ' 
  + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</p>'
  vehicle += '<p class="detail-description detail-item"><strong>Description:</strong> ' + data.inv_description + '</p>'
  vehicle += '</div>'
  vehicle += '</div>'
  return vehicle
}

/* ****************************************
 * Build the classification list HTML
 * **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Build the repair list HTML
 * **************************************** */
Util.buildRepairList = async function (repairs) {
  const vehicle = await invModel.getInventoryById(repairs[0].inv_id)
  let list = '<div class="repair-vehicle">'
  list += `<strong>Vehicle:</strong> ${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})<br>`
  list += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" style="max-width:100px;">`
  list += '</div>'

  list += '<ul class="repair-list">'
  for (const repair of repairs) {
    list += '<li class="repair-item">'
    list += `<div class="repair-info">
      <strong>Date:</strong> ${repair.repair_date}<br>
      <strong>Description:</strong> ${repair.repair_description}<br>
      <strong>Cost: </strong> $${repair.repair_cost}
    </div>`
    list += '</li>'
  }
  list += '</ul>'
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util