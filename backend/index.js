import { ApolloServer} from 'apollo-server';
import {usersTypeDefs} from './users/users.typeDefs.js';
import {usersResolvers} from './users/users.resolvers.js';
import {adminTypeDefs} from './admin/admin.typeDefs.js';
import {adminResolvers} from './admin/admin.resolvers.js';
import {coursesTypeDefs} from './courses/courses.typeDefs.js';
import {coursesResolvers} from './courses/courses.resolvers.js';
import {videosTypeDefs} from './videos/videos.typeDefs.js';
import {videosResolvers} from './videos/videos.resolvers.js';
import { s3TypeDefs } from './s3/s3.typeDefs.js';
import { s3Resolvers } from './s3/s3.resolvers.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
    typeDefs:[usersTypeDefs,adminTypeDefs,coursesTypeDefs,videosTypeDefs,s3TypeDefs],
    resolvers:[usersResolvers,adminResolvers,coursesResolvers,videosResolvers,s3Resolvers],
    context: ({ req }) => ({
        ...req.headers
    })
})


server.listen().then(({ url }) => {
    console.log(`Server listening at ${url}`)
})
