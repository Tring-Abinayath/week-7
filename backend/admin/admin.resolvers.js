import { createAdmin } from './admin.service.js';

export const adminResolvers = {
   
    Mutation: {
        createAdmin: async (_, _args, context) => {
            await createAdmin();
            return 'Admin Created Successfully'
        }
    }
};
