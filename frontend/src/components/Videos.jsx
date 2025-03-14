import { useLazyQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';
import './Videos.css'

const GET_VIDEOS_QUERY = gql`
    query getVideos($courseId: Int!,$bucket:String!){
        getVideos(courseId: $courseId,bucket: $bucket) {
            videoId
            courseId
            videoUrl
            preSignedUrl
        }
    }   
`;

function Videos() {
    const BUCKET = import.meta.env.VITE_BUCKET
    const [videoData, setVideoData] = useState([]);
    const { id } = useParams();

    const [getVideosQuery] = useLazyQuery(GET_VIDEOS_QUERY, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            setVideoData(data?.getVideos || [])
        },
        onError: (err) => {
            throw new Error("Error during getVideos:", err.message)
        }
    })

    useEffect(() => {
        getVideosQuery({
            variables: {
                courseId: parseInt(id),
                bucket: BUCKET
            }
        })
    }, [])

    if (!videoData?.length) {
        return <p>Videos not available</p>
    }

    return (
        <>            
            <div className='display'>
                {
                    videoData.map(data => (
                        <ReactPlayer
                            key={data.videoId}
                            url={data.preSignedUrl}
                            width="25%"
                            height="25%"
                            controls={true}
                        />
                    ))
                }
            </div>
        </>
    )
}
export default Videos;