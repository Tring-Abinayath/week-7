import pool from '../dbConnect.js'

export const getVideos = async (courseId) => {
    const result = await pool.query('SELECT * FROM course_videos WHERE course_id = $1', [courseId]);
    return result.rows;
}

export const uploadVideo = async (args) => {
    await pool.query(
        'INSERT INTO course_videos (course_id, video_url,updatedat) VALUES ($1,$2,$3)',
        [args.courseId, args.key, new Date()]
    );
}