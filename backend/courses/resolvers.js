import pool from '../dbConnect.js';
import { verifyJWT } from '../utils/verifyJWT.js';
import { isAdmin } from '../utils/isAdmin.js';

export const coursesResolvers = {
    Query: {

        getCourses: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const courses = await pool.query('SELECT * FROM courses WHERE course_id NOT IN(SELECT course_id FROM user_courses WHERE user_id=$1) AND deletedAt IS NULL ORDER BY course_id', [userId]);

                console.log("Courses:", courses.rows);
                return courses.rows;
            } catch (err) {
                console.error("Error getting courses:",err.message);
                // throw new Error('Error fetching courses from database');
                throw new Error(err.message);

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
            const courses = await pool.query('SELECT course_name FROM courses WHERE deletedAt IS NULL')
            console.log("Select course names", courses.rows)
            const findCourse = courses.rows.find(course => course.course_name.toLowerCase() === args.course_name.toLowerCase())
            console.log("FindCourses", findCourse)
            if (findCourse) {
                throw new Error('Course Already Exists')
            }

            await pool.query('INSERT INTO courses(course_name,updatedAt) VALUES($1,$2)', [args.course_name, new Date()])
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
            await pool.query('UPDATE courses SET course_name=$1,updatedAt=$2  WHERE course_id=$3', [args.course_name, new Date(), args.course_id])
            return 'Course updated successfully'
        },
        deleteCourse: async (_, args, context) => {
            console.log("Args:", args)
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }
            const enrolledCourses=await pool.query('select * from user_courses where course_id=$1 AND status=$2',[args.course_id,'enrolled']);
            if(enrolledCourses.rows.length>0){
                throw new Error( 'Failed to Delete Enrolled Course')
            }
            await pool.query('UPDATE courses SET deletedAt=$1 WHERE course_id=$2', [new Date(), args.course_id])
            return 'Course deleted successfully'
        }
    }
};
