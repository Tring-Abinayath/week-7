import { useLazyQuery} from '@apollo/client';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';
import './Videos.css'
import {GET_VIDEOS_QUERY} from '../../graphql/queries/queries.js'


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
            console.log("Error during getVideos:", err)
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