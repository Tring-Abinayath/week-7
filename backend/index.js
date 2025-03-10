import pool from './dbConnect.js';
import { ApolloServer, gql } from 'apollo-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const typeDefs = gql`
    type Users {
        user_id: Int
        user_name: String
        email: String
        role:String
    }

    type Courses {
        course_id: Int
        course_name: String
        #status: String # "completed" or "in-progress"
    }
    type UserCourses{
        user_id:Int
        course_id:Int
        course_name:String
    }

    input CreateUserInput {
        name: String!
        email: String!
        password: String!
        age: Int!
        phone_number: String!
    }
    
    type Token {
        token: String!    }

    type Query {
        getUsers: [Users]
        getCourses: [Courses]
        getUserCourses:[UserCourses]
    }

    type Mutation {
        signup(createUserInput: CreateUserInput!): String
        signin(email: String!, password: String!): Token
        addCourse(course_name:String!):String
        addUserCourses(course_id:Int!,course_name:String!):String
        deleteCourse(course_id:Int!):String
        editCourse(course_id:Int!,course_name:String!):String
        createAdmin:String
    }
`;

const resolvers = {
    Query: {
        getUsers: async (_, _args, context) => {
            try {
                const token = context.authorization;
                console.log("Tokenaskfhasduhfksjf:", token)
                const userId = await verifyJWT(token);
                console.log("Userid:", userId)
                const users = await pool.query('SELECT * FROM users WHERE user_id=$1', [userId]);
                console.log("Users:", users.rows);
                return users.rows;
            } catch (err) {
                console.error(err);
                throw new Error('Error fetching users from database');
            }
        },
        getCourses: async (_,_args,context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const courses = await pool.query('SELECT * FROM courses WHERE course_id NOT IN(SELECT course_id FROM user_courses WHERE user_id=$1)',[userId]);

                console.log("Courses:", courses.rows);
                return courses.rows;
            } catch (err) {
                console.error(err);
                throw new Error('Error fetching courses from database');
            }
        },
        getUserCourses:async(_,_args,context)=>{
            try{
                const token = context.authorization;
                const userId = await verifyJWT(token);
                const userCourses=await pool.query('SELECT * FROM user_courses WHERE user_id=$1',[userId]);
                console.log("User Course ------------:",userCourses.rows)
                return userCourses.rows
            }catch(error){
                throw new Error('Error during graphql request',error)
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
            console.log("Args:", args);

            const getUser = await pool.query('SELECT user_id,email, pwd FROM users WHERE email=$1', [args.email]);
            console.log("GetUser:", getUser.rows);

            if (getUser.rows.length == 0) {
                throw new Error('User does not exist');
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
            }, 'secret', { expiresIn: '1h' });

            return {
                token: token,
            };
        },
        addCourse: async (_, args, context) => {

            console.log("Args:", args)
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {

                throw new Error("Unauthorized")
            }

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
        addUserCourses: async (_, args, context) => {

            console.log("Args:", args);
            const token = context.authorization;
            const userId = await verifyJWT(token);
            await pool.query('INSERT INTO user_courses(user_id,course_id,course_name,status) VALUES($1,$2,$3,$4)', [userId, args.course_id,args.course_name,'enrolled'])
            return 'User enrolled successfully'
        },
        editCourse:async (_,args,context)=>{
            console.log("-----------------------------")
            console.log("Args:",args)
            const token=context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }
            const course = await pool.query('UPDATE courses SET course_name=$1 WHERE course_id=$2',[args.course_name,args.course_id])
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

const verifyJWT = async (token) => {
    let userToken;
    try {
        if (!token) {
            throw new Error('Unauthorized')
        }
        console.log("Original token:", token)
        if (token.includes('Bearer')) {
            userToken = token.split(" ")[1];
        } else {
            userToken = token;
        }

        console.log("userToken:", userToken)
        const verification = await jwt.verify(userToken, 'secret')
        console.log("--", verification)
        const data = JSON.parse(verification.data)
        console.log("dataaaa:", data)
        return data.user_id
    } catch (err) {
        console.log(err)
        throw new Error(err.message);
    }
}

const isAdmin = async (userId) => {
    const result = await pool.query('SELECT role FROM USERS WHERE user_id=$1', [userId])
    if (result.rows[0].role === 'admin') {
        return true
    } else {
        return false
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
        ...req.headers
    })
})

server.listen().then(({ url }) => {
    console.log(`Server listening at ${url}`)
})
