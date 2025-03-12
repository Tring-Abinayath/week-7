import { uploadToS3 } from "./s3.js";
import { verifyJWT } from '../utils/verifyJWT.js';

export const s3Resolvers = {
    Query: {
        getUploadPreSignedUrl: async (_, args,context) => {
            try {
                console.log("Args:",args)
                console.log("Bucket:",args.getPreSignedUrl.bucket)
                console.log("Key:",args.getPreSignedUrl.key)

                const token = context.authorization;
                await verifyJWT(token);
                const url = await uploadToS3(args.getPreSignedUrl.bucket,args.getPreSignedUrl.key)
                console.log("url:",url)
                return {url};
            } catch (err) {
                throw new Error(err.message)
            }
        }
    }
}