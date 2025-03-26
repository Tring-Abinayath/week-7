import { gql } from 'apollo-server';

export const usersTypeDefs = gql`

    type Users {
        user_id: Int
        user_name: String
        email: String
        role:String
    }

    type Courses {
        course_id: Int
        course_name: String
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
        token: String!    
    }

    type Query {
        getUsers: [Users]
        getUserCourses:[UserCourses]
    }

    type Mutation {
        signup(createUserInput: CreateUserInput!): String
        signin(email: String!, password: String!): Token
        addUserCourses(course_id:Int!,course_name:String!):String
    }

`;