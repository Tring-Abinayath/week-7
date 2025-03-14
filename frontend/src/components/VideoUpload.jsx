import { useEffect, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VideoUpload.css'
import Videos from './Videos.jsx'
import Headers from './Headers.jsx';

const BUCKET = import.meta.env.VITE_BUCKET;

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


const GET_UPLOAD_PRESIGNEDURL_QUERY = gql`
  query getUploadPreSignedUrl($getPreSignedUrl: GetPreSignedUrl!){
    getUploadPreSignedUrl(getPreSignedUrl: $getPreSignedUrl) {
      url
    }
  }
`;

const UPLOAD_VIDEO_QUERY = gql`
  mutation uploadVideo($courseId:Int!,$key:String!){
    uploadVideo(courseId:$courseId,key:$key)
  }
 `;

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  // const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isVideoUploaded, setIsVideoUploaded] = useState(false)

  const [uploadVideo] = useMutation(UPLOAD_VIDEO_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      console.log("--=-=sdfsa=-df0sa=fd", data);
      // setIsVideoUploaded(true)
      setLoading(false)
      // resetInput(); 
    },
    onError: (err) => {
      setLoading(false)
      throw new Error("Error during getVideo request:", err.message)
    }
  })

  // const [getVideosQuery] = useLazyQuery(GET_VIDEOS_QUERY, {
  //   fetchPolicy: 'no-cache',
  //   onCompleted: (data) => {
  //     console.log('--------------')
  //     console.log(data)
  //     setVideoData(data?.getVideos || [])
  //     setLoading(false)

  //   },
  //   onError: (err) => {
  //     setLoading(false)
  //     throw new Error("Error during getVideos:", err.message)
  //   }
  // })

  const [getUploadPreSignedUrl] = useLazyQuery(GET_UPLOAD_PRESIGNEDURL_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      console.log("Data in video:", data)
      const url = data.getUploadPreSignedUrl.url;
      const splitUrl = url.split('?')[0];
      const finalUrl = splitUrl.split(`https://${BUCKET}.s3.ap-south-1.amazonaws.com/`)[1]

      console.log(url, " ", splitUrl, " ", finalUrl)

      const response = await axios.put(url, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        }
      })
      console.log("response:", response)
      if (response.status === 200) {
        console.log("Axios request success")
        
        try {
          await uploadVideo({
            variables: {
              courseId: parseInt(id),
              key: finalUrl
            }
          })
        } catch (error) {
          console.log("Error:---------", error)
          throw new Error("Error during upload video:", error.message)
        }
      }
    },
    onError: (err) => {
      setLoading(false)
      console.log("Error during graphql request", err.message);
    }
  });

  const validFile = ['video/mp4']

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setFile(e.target.files[0])
    if (!validFile.find(type => type === file.type)) {
      toast.error('File must be in mp4 format')
      return;
    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error('Please upload the video.')
      return;
    }

    console.log("file---", file)
    console.log(`${Date.now()}-${file.name}`)
    setLoading(true)
    try {
      console.log('khfsidf-=================')
      await getUploadPreSignedUrl({
        variables: {
          getPreSignedUrl: {
            bucket: BUCKET,
            key: `videos/${Date.now()}-${file.name}`
          }
        }
      });

    } catch (error) {
      setLoading(false)
      console.log("error:", error)

      throw new Error('Error uploading video.', error);
    }
  }

  const handleCancel = () => {
    navigate('/AdminDashboard');
  }


  return (
    <>
      <Headers />


      <div className='videoInput'>

        <form>
          <input type="file" onChange={handleFileChange} />
          <button id='upload' onClick={handleSubmit}>Upload Video</button>
          <button id='upload' type="button" onClick={handleCancel}>Cancel</button>
        </form>
        </div>

        {/* <Videos/> */}


        {loading ?
          <p>Loading Please Wait...</p>

          :
          <Videos/>
        }
          {/* <Videos isVideoUploaded={isVideoUploaded} setIsVideoUploaded={setIsVideoUploaded} /> */}
        {/* } */}
        {/* videoData={videoData} setVideoData={setVideoData} */}
      
    </>
  );
};

export default VideoUpload;