import pool from '../dbConnect.js';
import { downloadToS3 } from '../S3/s3.js';
import { verifyJWT } from '../utils/verifyJWT.js';
import { isAdmin } from '../utils/isAdmin.js';

export const videosResolvers = {
    Query: {
        getVideos: async (_, { courseId, bucket }, context) => {
            console.log("courseId for getVideos:",courseId)
            const token = context.authorization;
            await verifyJWT(token)
            const result = await pool.query('SELECT * FROM course_videos WHERE course_id = $1', [courseId]);
            console.log(result.rows)
            const rows = result.rows;

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

            console.log("Args:", args)

            const token = context.authorization;
            const userId = await verifyJWT(token);
            if (! await isAdmin(userId)) {
                throw new Error("Unauthorized")
            }

            const result = await pool.query(
                'INSERT INTO course_videos (course_id, video_url) VALUES ($1, $2)',
                [args.courseId, args.key]
            );

            return "Video Uploaded Successfully";
        }
    }
};

