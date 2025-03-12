import { gql } from 'apollo-server';

export const s3TypeDefs = gql`

    input GetPreSignedUrl{
        bucket:String!
        key:String!
    }

    type PreSignedUrl{
        url:String!
    }

    type Query{
        getUploadPreSignedUrl(getPreSignedUrl:GetPreSignedUrl!):PreSignedUrl
    }
`;
