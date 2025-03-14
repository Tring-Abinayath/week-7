import { ApolloServer} from 'apollo-server';
import {usersTypeDefs} from './users/typeDefs.js';
import {usersResolvers} from './users/resolvers.js';
import {adminTypeDefs} from './admin/typeDefs.js';
import {adminResolvers} from './admin/resolvers.js';
import {coursesTypeDefs} from './courses/typeDefs.js';
import {coursesResolvers} from './courses/resolvers.js';
import {videosTypeDefs} from './videos/typeDefs.js';
import {videosResolvers} from './videos/resolvers.js';
import { s3TypeDefs } from './S3/typeDefs.js';
import { s3Resolvers } from './S3/resolvers.js';
import dotenv from 'dotenv';

dotenv.config();

console.log("env-----------------",process.env.JWT_KEY)
const server = new ApolloServer({
    typeDefs:[usersTypeDefs,adminTypeDefs,coursesTypeDefs,videosTypeDefs,s3TypeDefs],
    resolvers:[usersResolvers,adminResolvers,coursesResolvers,videosResolvers,s3Resolvers],
    context: ({ req }) => ({
        ...req.headers
    }),
})


server.listen().then(({ url }) => {
    console.log(`Server listening at ${url}`)
})




