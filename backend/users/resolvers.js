import bcrypt from 'bcryptjs';
import pool from '../dbConnect.js';
import { verifyJWT } from '../utils/verifyJWT.js';
import jwt from 'jsonwebtoken';


export const usersResolvers = {
    Query: {
        getUsers: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const users = await pool.query('SELECT * FROM users WHERE user_id=$1', [userId]);
                return users.rows;
            } catch (err) {
                throw new Error('Error fetching users from database');
            }
        },
        getUserCourses: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const userCourses = await pool.query('select uc.user_id,uc.course_id,c.course_name from user_courses uc INNER JOIN courses c ON uc.course_id = c.course_id WHERE user_id=$1', [userId]);
                return userCourses.rows
            } catch (error) {
                throw new Error('Error during graphql request', error)
            }
        }
    },
    Mutation: {
        signup: async (_, { createUserInput }) => {
            console.log(createUserInput);

            const checkUser = await pool.query('SELECT email FROM users WHERE email=$1', [createUserInput.email]);
            if (checkUser.rows.length > 0) {
                throw new Error('User Already Exists');
            }

            const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

            const result = await pool.query(
                'INSERT INTO users(user_name, email, pwd, age, phone_no) VALUES ($1, $2, $3, $4, $5)',
                [createUserInput.name, createUserInput.email, hashedPassword, createUserInput.age, createUserInput.phone_number]
            );
            return 'User Created Successfully';
        },
        signin: async (_, args) => {
            const jwt_key=process.env.JWT_KEY
            const getUser = await pool.query('SELECT user_id,email, pwd FROM users WHERE email=$1', [args.email]);
            console.log("GetUser:", getUser.rows);

            if (getUser.rows.length == 0) {
                throw new Error('Incorrect Email or password');
            }
            const storedHashedPassword = getUser.rows[0].pwd;

            const isPassword = await bcrypt.compare(args.password, storedHashedPassword);
            if (!isPassword) {
                throw new Error('Incorrect Email or Password');
            }

            const token = await jwt.sign({
                data: JSON.stringify({
                    user_id: getUser.rows[0].user_id,
                    email: getUser.rows[0].email
                })
            }, jwt_key , { expiresIn: '1h' });

            return {
                token: token,
            };
        },
        addUserCourses: async (_, args, context) => {
            const token = context.authorization;
            const userId = await verifyJWT(token);
            await pool.query('INSERT INTO user_courses(user_id,course_id,status) VALUES($1,$2,$3)', [userId, args.course_id,'enrolled'])
            return 'User enrolled successfully'
        }
    }
};
