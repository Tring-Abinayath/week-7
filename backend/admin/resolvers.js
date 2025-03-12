import bcrypt from 'bcryptjs';
import pool from '../dbConnect.js';
import { isAdmin } from '../utils/isAdmin.js';
import { verifyJWT } from '../utils/verifyJWT.js';


export const adminResolvers = {
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
        }
    },
    Mutation: {
        
        addCourse: async (_, args, context) => {

            console.log("Argsssssssssssss:", args)
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {

                throw new Error("Unauthorized")
            }
            console.log("--------")
            const courses = await pool.query('SELECT course_name FROM courses')
            console.log("Select course names", courses.rows)
            const findCourse = courses.rows.find(course => course.course_name.toLowerCase() === args.course_name.toLowerCase())
            console.log("FindCourses", findCourse)
            if (findCourse) {
                throw new Error('Course ALready Exists')
            }

            await pool.query('INSERT INTO courses(course_name) VALUES($1)', [args.course_name])
            return 'Course added successfully'

        },
        editCourse: async (_, args, context) => {
            console.log("-----------------------------")
            console.log("Args:", args)
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }
            const course = await pool.query('UPDATE courses SET course_name=$1 WHERE course_id=$2', [args.course_name, args.course_id])
            return 'Course updated successfully'
        },
        deleteCourse: async (_, args, context) => {
            console.log("Args:", args)
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }
            const course = await pool.query('DELETE FROM courses WHERE course_id=$1', [args.course_id])
            return 'Course deleted successfully'
        },
        createAdmin: async (_, _args, context) => {
            const hashedPassword = await bcrypt.hash("admin@123", 10);
            await pool.query('INSERT INTO users(user_name,email,pwd,age,phone_no,role) VALUES($1,$2,$3,$4,$5,$6)',
                ['Admin', 'admin@gmail.com', hashedPassword, '25', '9076512853', 'admin']
            )
            return 'Admin Created Successfully'
        }
    }
};
