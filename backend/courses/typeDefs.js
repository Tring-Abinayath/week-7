import { gql } from 'apollo-server';

export const coursesTypeDefs = gql`

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

    type Query {
        getCourses: [Courses]
        getUserCourses:[UserCourses]
    }

    type Mutation {
        addUserCourses(course_id:Int!,course_name:String!):String
    }

`;