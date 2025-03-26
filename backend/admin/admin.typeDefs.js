import { gql } from 'apollo-server';

export const adminTypeDefs = gql`
    type Mutation {
        createAdmin:String
    }

`;