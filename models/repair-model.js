const pool = require("../database/index.js")

/* ***************************
 *  Get all repair data
 * ************************** */
const getAllRepairs = async () => {
    const query = `
        SELECT *
        FROM public.repairs
    `;
    const { rows } = await pool.query(query);
    return rows;
};

/* ***************************
 *  Get repairs by inventory ID
 * ************************** */
const getRepairsByInventoryId = async (inv_id) => {
    const query = `
        SELECT *
        FROM public.repairs
        WHERE inv_id = $1
    `;
    const { rows } = await pool.query(query, [inv_id]);
    return rows;
};

/* ***************************
 *  Add a new repair record
 * ************************** */
const addRepair = async (inv_id, repair_description, repair_cost, repair_date) => {
    const query = `
        INSERT INTO public.repairs (inv_id, repair_description, repair_cost, repair_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const { rows } = await pool.query(query, [inv_id, repair_description, repair_cost, repair_date]);
    return rows[0];
};

module.exports = {
    getAllRepairs,
    getRepairsByInventoryId,
    addRepair,
};