import { useLazyQuery,gql } from '@apollo/client';
import { useEffect,useState } from 'react';
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

const BUCKET='learning-platform-media'

function Videos() {

    const [videoData,setVideoData]=useState([]);
    const {id} = useParams();

    const [getVideosQuery]=useLazyQuery(GET_VIDEOS_QUERY,{
        fetchPolicy:'no-cache',
        onCompleted:(data)=>{
            console.log('--------------')
            console.log(data)
            setVideoData(data?.getVideos||[])
        },
        onError:(err)=>{
            throw new Error("Error during getVideos:",err.message)
        }
    })
console.log("-----",videoData)
    useEffect(()=>{
        console.log("Inside useeffet")
        getVideosQuery({
            variables:{
                courseId:parseInt(id),
                bucket:BUCKET
            }
        })
    },[])

    if(videoData.length===0){
        return <p>Videos not available</p>
    }

    return (

        <div>
            {
                videoData.map(data=>(
                    <ReactPlayer
                    key={data.videoId}
                        url={data.preSignedUrl}
                        width="50%" 
                        height="400px"
                        controls={true} 
                    />
                ))
            }
        </div>
    )
}
export default Videos;