import pool from '../dbConnect.js'
export const isAdmin = async (userId) => {
    const result = await pool.query('SELECT role FROM USERS WHERE user_id=$1', [userId])
    return result.rows[0].role === 'admin'
}