import { useState } from 'react';
import { gql,useLazyQuery,useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './VideoUpload.css'
const BUCKET='learning-platform-media';

const GET_UPLOAD_PRESIGNEDURL_QUERY = gql`
  query getUploadPreSignedUrl($getPreSignedUrl: GetPreSignedUrl!){
    getUploadPreSignedUrl(getPreSignedUrl: $getPreSignedUrl) {
      url
    }
  }
`;

 const UPLOAD_VIDEO_QUERY=gql`
  mutation uploadVideo($courseId:Int!,$key:String!){
    uploadVideo(courseId:$courseId,key:$key)
  }
 `;

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const {id} = useParams();

  const [uploadVideo]=useMutation(UPLOAD_VIDEO_QUERY,{
    fetchPolicy:'no-cache',
    onCompleted:(data)=>{
      console.log(data);
      
    },
    onError:(err)=>{
      throw new Error("Error during getVideo request:",err.message)
    }
  })

  const [getUploadPreSignedUrl] = useLazyQuery(GET_UPLOAD_PRESIGNEDURL_QUERY,{
    fetchPolicy:"no-cache",
    onCompleted:async(data)=>{
        console.log("Data in video:",data)
        const url=data.getUploadPreSignedUrl.url;
        const splitUrl=url.split('?')[0];
        const finalUrl=splitUrl.split(`https://${BUCKET}.s3.ap-south-1.amazonaws.com/`)[1]

        console.log(url," ",splitUrl," ",finalUrl)

        const response=await axios.put(url,file,{
          headers:{
            'Content-Type':'application/octet-stream',
            'Access-Control-Allow-Origin':'*'
          }
        })
        console.log("response:",response)
        if(response.status===200){
          try{
            await uploadVideo({
              variables:{
                courseId:parseInt(id),
                key:finalUrl
              }
            })
          }catch(error){
            throw new Error("Error during upload video:",error.message)
          }
        }
    },
    onError:(err)=>{
        console.log("Error during graphql request",err.message);
    }
  });

  const validFile=['video/mp4']

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    const file=e.target.files[0];
    setFile(e.target.files[0])
    if(!validFile.find(type=>type===file.type)){
      // setError('File must be in mp4 format')
      toast.error('File must be in mp4 format')
      return;
    }

    // const form=new FormData();
    // form.append('video',file);
    // setFile(e.target.files[0]);
    // console.log("Formdata:",form)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      // setError('Please upload the video.');
      toast.error('Please upload the video.')
      return;
    }

    console.log("file---",file)
    console.log(`${Date.now()}-${file.name}`)
    try {
      await getUploadPreSignedUrl({
        variables: {
          getPreSignedUrl:{
            bucket:BUCKET,
            key:`videos/${Date.now()}-${file.name}`
          }
        }
      });
      toast.success("Video Uploaded Successfully!");

    } catch (error) {
      console.log("error:",error)

      throw new Error('Error uploading video.',error);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Uploading Course Video</h2>
        <input type="file" onChange={handleFileChange}  />
      </div>
      <button type="submit">Upload Video</button>
      <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false}/>
      {error && <p>{error}</p>}
    </form>
  );
};

export default VideoUpload;