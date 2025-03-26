import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query {
        getUsers {
            user_id
            user_name
            email
            role
        }
    }
`;

export const GET_COURSES = gql`
    query {
        getCourses {
            course_id
            course_name
        }
    }
`;

export const GET_USER_COURSES = gql`
    query{
        getUserCourses{
            user_id
            course_id
            course_name
        }
    }
`;

export const GET_VIDEOS_QUERY = gql`
    query getVideos($courseId: Int!,$bucket:String!){
        getVideos(courseId: $courseId,bucket: $bucket) {
            videoId
            courseId
            videoUrl
            preSignedUrl
        }
    }   
`;

export const GET_UPLOAD_PRESIGNEDURL_QUERY = gql`
  query getUploadPreSignedUrl($getPreSignedUrl: GetPreSignedUrl!){
    getUploadPreSignedUrl(getPreSignedUrl: $getPreSignedUrl) {
      url
    }
  }
`;