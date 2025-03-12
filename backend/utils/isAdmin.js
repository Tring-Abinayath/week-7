import pool from '../dbConnect.js'
export const isAdmin = async (userId) => {
    console.log("Inside admin")
    const result = await pool.query('SELECT role FROM USERS WHERE user_id=$1', [userId])
    if (result.rows[0].role === 'admin') {
        return true
    } else {
        return false
    }
}