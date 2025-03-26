import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
    mutation signup($createUserInput:CreateUserInput!){
        signup(createUserInput:$createUserInput)
    }
`;

export const SIGNIN_MUTATION = gql`
    mutation signin($email:String!,$password:String!){
        signin(email:$email,password:$password){
            token   
        }
    }
`;

export const ADD_COURSE = gql`
    mutation addCourse($courseName:String!){
        addCourse(course_name: $courseName)
  }
`;

export const EDIT_COURSE = gql`
    mutation editCourse($courseId:Int!,$courseName:String!){
        editCourse(course_id:$courseId,course_name:$courseName)
    }
`;

export const DELETE_COURSE = gql`
    mutation deleteCourse($courseId:Int!){
        deleteCourse(course_id:$courseId)
    }
`;

export const ADD_USER_COURSES = gql`
    mutation addUserCourses($courseId:Int!,$courseName:String!){
        addUserCourses(course_id:$courseId,course_name:$courseName)
    }
`;

export const UPLOAD_VIDEO_QUERY = gql`
  mutation uploadVideo($courseId:Int!,$key:String!){
    uploadVideo(courseId:$courseId,key:$key)
  }
 `;