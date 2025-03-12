import pool from '../dbConnect.js';
import { verifyJWT } from '../utils/verifyJWT.js';

export const coursesResolvers = {
    Query: {

        getCourses: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const courses = await pool.query('SELECT * FROM courses WHERE course_id NOT IN(SELECT course_id FROM user_courses WHERE user_id=$1) ORDER BY course_id', [userId]);

                console.log("Courses:", courses.rows);
                return courses.rows;
            } catch (err) {
                console.error(err);
                throw new Error('Error fetching courses from database');
            }
        },
        getUserCourses: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const userCourses = await pool.query('SELECT * FROM user_courses WHERE user_id=$1', [userId]);
                console.log("User Course ------------:", userCourses.rows)
                return userCourses.rows
            } catch (error) {
                throw new Error('Error during graphql request', error)
            }
        }
    },
    Mutation: {
        
        addUserCourses: async (_, args, context) => {

            console.log("Args:", args);
            const token = context.authorization;
            const userId = await verifyJWT(token);
            await pool.query('INSERT INTO user_courses(user_id,course_id,course_name,status) VALUES($1,$2,$3,$4)', [userId, args.course_id, args.course_name, 'enrolled'])
            return 'User enrolled successfully'
        }
    }
};
