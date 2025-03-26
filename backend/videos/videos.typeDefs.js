import { gql } from 'apollo-server';

export const videosTypeDefs = gql`

    type Video {
        videoId:Int
        courseId: Int
        videoUrl: String
        preSignedUrl:String
    }

    type Query {
        getVideos(courseId: Int!,bucket:String!): [Video]
    }

    type Mutation {
        uploadVideo(courseId: Int!, key: String!): String
    }

`;