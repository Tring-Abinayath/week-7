import { gql } from 'apollo-server';

export const adminTypeDefs = gql`

     type Query {
        getCourses: [Courses]
    }

    type Mutation {
        addCourse(course_name:String!):String
        deleteCourse(course_id:Int!):String
        editCourse(course_id:Int!,course_name:String!):String
        createAdmin:String
    }

`;