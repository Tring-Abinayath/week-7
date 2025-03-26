import pool from '../dbConnect.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (userId) => {
    const users = await pool.query('SELECT * FROM users WHERE user_id=$1', [userId]);
    return users.rows;
}

export const getUserCourses = async (userId) => {
    const userCourses = await pool.query('select uc.user_id,uc.course_id,c.course_name from user_courses uc INNER JOIN courses c ON uc.course_id = c.course_id WHERE user_id=$1', [userId]);
    return userCourses.rows
}

export const addUserCourses = async (args, userId) => {
    await pool.query('INSERT INTO user_courses(user_id,course_id,status) VALUES($1,$2,$3)', [userId, args.course_id, 'enrolled'])
}

export const isEmail = async (email) => {
    const checkUser = await pool.query('SELECT email FROM users WHERE email=$1', [email]);
    if (checkUser.rows.length > 0) {
        throw new Error('User Already Exists');
    }
}

export const signup = async (createUserInput) => {

    try {
        await isEmail(createUserInput.email);
    } catch (err) {
        throw err
    }
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    await pool.query(
        'INSERT INTO users(user_name, email, pwd, age, phone_no) VALUES ($1, $2, $3, $4, $5)',
        [createUserInput.name, createUserInput.email, hashedPassword, createUserInput.age, createUserInput.phone_number]
    );
}

export const isEmailSignin = async (email) => {
    return await pool.query('SELECT user_id,email, pwd FROM users WHERE email=$1', [email]);
}