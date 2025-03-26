import pool from '../dbConnect.js';

export const getCourses = async (userId) => {
    const courses = await pool.query('SELECT * FROM courses WHERE course_id NOT IN(SELECT course_id FROM user_courses WHERE user_id=$1) AND deletedAt IS NULL ORDER BY course_id', [userId]);
    return courses.rows;
}

export const editCourse = async (args, userId) => {
    await pool.query('UPDATE courses SET course_name=$1,updatedAt=$2  WHERE course_id=$3', [args.course_name, new Date(), args.course_id])
}

export const isCourse = async (args) => {
    const courses = await pool.query('SELECT course_name FROM courses WHERE deletedAt IS NULL')
    const findCourse = courses.rows.find(course => course.course_name.toLowerCase() === args.course_name.toLowerCase())
    return findCourse
}

export const addCourse = async (args) => {

    if (await isCourse(args)) {
        throw new Error("Course Already Exists")
    }
    await pool.query('INSERT INTO courses(course_name,updatedAt) VALUES($1,$2)', [args.course_name, new Date()])
}

export const isCourseEnrolled=async(args)=>{
    const enrolledCourses = await pool.query('select * from user_courses where course_id=$1 AND status=$2', [args.course_id, 'enrolled']);
    if (enrolledCourses.rows.length > 0) {
        throw new Error('Failed to Delete Enrolled Course')
    }
}

export const deleteCourse = async (args) => {
    try{
        await isCourseEnrolled(args)
    }catch(err){
        throw err
    }
    await pool.query('UPDATE courses SET deletedAt=$1 WHERE course_id=$2', [new Date(), args.course_id])
}