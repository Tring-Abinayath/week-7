import { verifyJWT } from '../utils/verifyJWT.js';
import { isAdmin } from '../utils/isAdmin.js';
import { getCourses,editCourse, addCourse, deleteCourse } from './courses.service.js';

export const coursesResolvers = {
    Query: {

        getCourses: async (_, _args, context) => {
            try {
                const token = context.authorization;
                const userId = await verifyJWT(token);
                return await getCourses(userId)
            } catch (err) {
                throw new Error(err.message);
            }
        }
    },
    Mutation: {
        addCourse: async (_, args, context) => {
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {

                throw new Error("Unauthorized")
            }

            try{
                await addCourse(args)
            }catch(err){
                throw new Error(err.message)
            }
            return 'Course added successfully'

        },
        editCourse: async (_, args, context) => {
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }
            await editCourse(args,userId)
            return 'Course updated successfully'
        },
        deleteCourse: async (_, args, context) => {
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }

            try{
                await deleteCourse(args)
            }catch(err){
                throw new Error(err.message)
            }
            return 'Course deleted successfully'
        }
    }
};
