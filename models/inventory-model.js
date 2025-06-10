const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all data for a specific vehcile in inventory
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error " + error)
  }
}

/* ***************************
 *  Check if classification alreadt exists
 * ************************** */
async function classificationExists(classification_name) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_name = $1`,
      [classification_name]
    )
    return data.rows.length > 0
  }
  catch (error) {
    console.error("classificationExists error: " + error)
    return error.message
  }
}

/* ***************************
 *  Insert new classification into the database
 * ************************** */
async function insertClassification(classification_name) {
  try {
    return await pool.query(
      `INSERT INTO public.classification (classification_name) 
      VALUES ($1) RETURNING *`,
      [classification_name]
    )
  } catch (error) {
    console.error("insertClassification error: " + error)
    return error.message
  }
}

/* ***************************
 *  Insert new inventory item into the database
 * ************************** */
async function insertInventory(vehicle) {
  try {
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
    } = vehicle

    return await pool.query(
      `INSERT INTO public.inventory(
        inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
        inv_price, inv_year, inv_miles, inv_color, classification_id
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
      ]
    )
  } catch (error) {
    console.error("insertInventory error: " + error)
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, classificationExists, insertClassification, insertInventory}