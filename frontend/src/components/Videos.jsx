import { useLazyQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom';
import './Videos.css'
// import { ClipLoader } from 'react-spinners';

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


// {videoData,setVideoData}
// function Videos(isVideoUploaded,setIsVideoUploaded) {
function Videos() {


    const BUCKET = import.meta.env.VITE_BUCKET
    console.log("BUcket:------", BUCKET)
    const [videoData, setVideoData] = useState([]);
    const { id } = useParams();

    const [getVideosQuery] = useLazyQuery(GET_VIDEOS_QUERY, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('--------------')
            console.log(data)
            setVideoData(data?.getVideos || [])
        },
        onError: (err) => {
            throw new Error("Error during getVideos:", err.message)
        }
    })
    console.log("-----", videoData)
    useEffect(() => {
        console.log("Inside useeffet")
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

    //  useEffect(() => {
    //     console.log("Inside useeffet")
    //     getVideosQuery({
    //         variables: {
    //             courseId: parseInt(id),
    //             bucket: BUCKET
    //         }
    //     })
    //     // setIsVideoUploaded(!isVideoUploaded)
    // }, [isVideoUploaded])


    return (
        <>
            {/* {loading ?
            <div className="loader-container">
            <ClipLoader color="#3498db" loading={loading} size={50} />
          </div>
                : */}
            <button>Back</button>
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
            {/* } */}
        </>
    )
}
export default Videos;