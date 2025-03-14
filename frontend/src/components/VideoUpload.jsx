import { useEffect, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VideoUpload.css'
import Videos from './Videos.jsx'
import Headers from './Headers.jsx';
import { useForm } from 'react-hook-form';

const BUCKET = import.meta.env.VITE_BUCKET;

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
  const [loading, setLoading] = useState(false);
  const [uploadVideo] = useMutation(UPLOAD_VIDEO_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setLoading(false)
      toast.success(data.uploadVideo)
    },
    onError: (err) => {
      setLoading(false)
      throw new Error("Error during getVideo request:", err.message)
    }
  })

  const [getUploadPreSignedUrl] = useLazyQuery(GET_UPLOAD_PRESIGNEDURL_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      const url = data.getUploadPreSignedUrl.url;
      const splitUrl = url.split('?')[0];
      const finalUrl = splitUrl.split(`https://${BUCKET}.s3.ap-south-1.amazonaws.com/`)[1]
      const response = await axios.put(url, file, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        }
      })
      if (response.status === 200) {
        try {
          await uploadVideo({
            variables: {
              courseId: parseInt(id),
              key: finalUrl
            }
          })
        } catch (error) {
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
    const file = e.target.files[0];
    setFile(e.target.files[0])
    if (!validFile.find(type => type === file.type)) {
      toast.error('File must be in mp4 format')
      return;
    }

  };

  const handleFormSubmit = async () => {

    setLoading(true)
    try {
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
      throw new Error('Error uploading video.', error);
    }
    reset()
  }

  const handleCancel = () => {
    navigate('/AdminDashboard');
  }

  const {
    register,
    handleSubmit,
    formState:{errors},
    reset
  } = useForm();

  return (
    <>
      <Headers />

      <div className='videoInput'>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <input
            type="file"
            name="videoFile"
            {...register('videoFile', { required: {value:true, message: "Video is required"} })}
            onChange={handleFileChange}
          />

          <button id='upload' type="submit">Upload Video</button>
          <button id='upload' type="button" onClick={handleCancel}>Cancel</button>

          {errors.videoFile && <div className='err'>{errors.videoFile.message}</div>}

        </form>

      </div>

      {loading ?
        <p>Loading Please Wait...</p>

        :
        <Videos />
      }
    </>
  );
};

export default VideoUpload;