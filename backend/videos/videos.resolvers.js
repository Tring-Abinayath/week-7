import { downloadToS3 } from '../s3/s3.js';
import { verifyJWT } from '../utils/verifyJWT.js';
import { isAdmin } from '../utils/isAdmin.js';
import { getVideos,uploadVideo } from './videos.service.js';

export const videosResolvers = {
    Query: {
        getVideos: async (_, { courseId, bucket }, context) => {
            const token = context.authorization;
            await verifyJWT(token)
            const rows=await getVideos(courseId)
            console.log("ROWS:",rows)

            const formattedRows = rows.map(async (row) => {
                const signedUrl = await downloadToS3(bucket, row.video_url)
                return {
                    videoId: row.video_id,
                    courseId: row.course_id,
                    videoUrl: row.video_url,
                    preSignedUrl: signedUrl
                }
            })

            return formattedRows;
        }
    },
    Mutation: {
        uploadVideo: async (_, args, context) => {
            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }

            uploadVideo(args)
            return "Video Uploaded Successfully";
        }
    }
};

