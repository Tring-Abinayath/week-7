import { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VideoUpload.css'
import Videos from '../videoList/Videos.jsx'
import Header from '../header/Header.jsx';
import { useForm } from 'react-hook-form';
import { GET_UPLOAD_PRESIGNEDURL_QUERY } from '../../graphql/queries/queries.js';
import { UPLOAD_VIDEO_QUERY } from '../../graphql/mutations/mutations.js';

const BUCKET = import.meta.env.VITE_BUCKET;

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadVideo] = useMutation(UPLOAD_VIDEO_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      console.log("ONCOMPLETE",data)
      setLoading(false)
      toast.success(data.uploadVideo)
    },
    onError: (err) => {
      setLoading(false)
      console.log("Error during uploadVideo request:", err)
    }
  })

  const [getUploadPreSignedUrl] = useLazyQuery(GET_UPLOAD_PRESIGNEDURL_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: async (data) => {
      const url = data.getUploadPreSignedUrl.url;
      const splitUrl = url.split('?')[0];
      const finalUrl = splitUrl.split(`https://${BUCKET}.s3.ap-south-1.amazonaws.com/`)[1]
      console.log('FILE:',file)
      console.log("Final url:",finalUrl)
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
          console.log("Error during upload video:", error)
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
      console.log('Error in getUploadPreSignedUrl', error);
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
      <Header />

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