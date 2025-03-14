import { gql } from 'apollo-server';

export const coursesTypeDefs = gql`

    type Courses {
        course_id: Int
        course_name: String
    }
    type UserCourses{
        user_id:Int
        course_id:Int
        course_name:String
    }

    type Query {
        getCourses: [Courses]
    }

    type Mutation {
        addCourse(course_name:String!):String
        deleteCourse(course_id:Int!):String
        editCourse(course_id:Int!,course_name:String!):String
    }

`;