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
        token: String!    
    }

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
    }

`;