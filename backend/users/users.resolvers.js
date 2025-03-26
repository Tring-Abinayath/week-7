import bcrypt from 'bcryptjs';
import { verifyJWT } from '../utils/verifyJWT.js';
import jwt from 'jsonwebtoken';
import { getUsers, getUserCourses, addUserCourses, signup, isEmailSignin } from './users.service.js';

export const usersResolvers = {
    Query: {
        getUsers: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                return await getUsers(userId)
            } catch (err) {
                throw new Error(err.message);
            }
        },
        getUserCourses: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                return getUserCourses(userId)
            } catch (error) {
                throw new Error('Error during graphql request', error)
            }
        }
    },
    Mutation: {
        signup: async (_, { createUserInput }) => {
            await signup(createUserInput)
            return 'User Created Successfully';
        },
        signin: async (_, args) => {
            const jwt_key = process.env.JWT_KEY
            const getUser = await isEmailSignin(args.email)
            if (getUser.rows.length == 0) {
                throw new Error('Incorrect Email or password');
            }
            const storedHashedPassword = getUser.rows[0].pwd;

            const isPassword = await bcrypt.compare(args.password, storedHashedPassword);
            if (!isPassword) {
                throw new Error('Incorrect Email or Password');
            }
            
            // const token = await jwt.sign({
            //     data: JSON.stringify({
            //         user_id: getUser.rows[0].user_id,
            //         email: getUser.rows[0].email
            //     })
            // }, jwt_key , { expiresIn: '1h' });

            const token = await jwt.sign({
                user_id: getUser.rows[0].user_id,
                email: getUser.rows[0].email
            }, jwt_key, { expiresIn: '1h' });

            return {
                token: token,
            };
        },
        addUserCourses: async (_, args, context) => {
            const token = context.authorization;
            const userId = await verifyJWT(token);
            addUserCourses(args, userId);
            return 'User enrolled successfully'
        }
    }
};
