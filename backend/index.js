import pool from './dbConnect.js';
import { ApolloServer, gql } from 'apollo-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const typeDefs = gql`

    type Users{
        user_id:Int
        user_name:String
        email:String
    }

    input CreateUserInput{
        name:String!
        email:String!
        password:String!
        age:Int!
        phone_number:String!
    }

    type token{
        token:String!
        email:String!
    }

    type Query{
        getUsers:[Users]
    }

    type Mutation{
        signup(createUserInput:CreateUserInput!):String
        signin(email:String!,password:String!):token
    }   
   

`;

const resolvers = {
    Query: {
        getUsers: async () => {
            try {
                const users = await pool.query('SELECT * FROM users'); // Query the database
                console.log("Users:",users.rows)
                return users.rows; // Return the rows to GraphQL
            } catch (err) {
                console.error(err);
                throw new Error('Error fetching users from database');
            }
        }
    },
    Mutation: {
        signup: async (_, { createUserInput }) => {

            console.log(createUserInput)

            const checkUser = await pool.query('SELECT email FROM users WHERE email=$1', [createUserInput.email])
            if (checkUser.rows.length > 0) {
                throw new Error('User Already Exists');
            }

            const hashedPassword = await bcrypt.hash(createUserInput.password, 10);  // 10 is the salt rounds

            const result = await pool.query(
                'INSERT INTO users(user_name,email,pwd,age,phone_no) VALUES ($1,$2,$3,$4,$5)',
                [createUserInput.name,createUserInput.email, hashedPassword, createUserInput.age, createUserInput.phone_number]

            )
            return 'User Created Successfully'
        },
        signin:async(_,args)=>{
            console.log("Args:",args);

            const getUser=await pool.query('SELECT email,pwd FROM users WHERE email=$1',[args.email])
            console.log("GetUser:",getUser.rows)

            if(getUser.rows.length==0){
                throw new Error('User does not exist');
            }
            const storedHashedPassword=getUser.rows[0].pwd;

            const isPassword=await bcrypt.compare(args.password,storedHashedPassword);
            if(!isPassword){
                throw new Error('Incorrect Email or Password')
            }

            const token=await jwt.sign({
                data:JSON.stringify({
                    user_id:getUser.rows[0].user_id,
                    email:getUser.rows[0].email
                })
            },'secret',{expiresIn: '1h' })
            
            console.log(token)

            return {
                token:token,
                email:getUser.rows[0].email
            }

        }
    }

}

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
        return data.user_id
    } catch (err) {
        console.log(err)
        throw new Error(err.message);
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