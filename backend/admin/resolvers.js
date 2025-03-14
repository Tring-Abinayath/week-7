import bcrypt from 'bcryptjs';
import pool from '../dbConnect.js';

export const adminResolvers = {
   
    Mutation: {
        createAdmin: async (_, _args, context) => {
            const hashedPassword = await bcrypt.hash("admin@123", 10);
            await pool.query('INSERT INTO users(user_name,email,pwd,age,phone_no,role) VALUES($1,$2,$3,$4,$5,$6)',
                ['Admin', 'admin@gmail.com', hashedPassword, '25', '9076512853', 'admin']
            )
            return 'Admin Created Successfully'
        }
    }
};
