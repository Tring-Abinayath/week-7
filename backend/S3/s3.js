import {PutObjectCommand,GetObjectCommand,S3Client} from '@aws-sdk/client-s3'; 
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const s3=new S3Client({
    region: "ap-south-1"
});
// const BUCKET=process.env.BUCKET;
export const uploadToS3=async(bucket,key)=>{
    console.log(bucket,key)
    const command=new PutObjectCommand({
        Bucket:bucket,
        Key:key
    })
console.log("Command:",command)
    try{
        console.log('-------------')
        const url=await getSignedUrl(s3,command,{expiresIn:3600})
        console.log(url)
        return url
    }catch(error){
        throw new Error(error)
    }
}

export const downloadToS3=async(bucket,key)=>{
    console.log(bucket,key)
    const command=new GetObjectCommand({
        Bucket:bucket,
        Key:key
    })
console.log("Command:",command)
    try{
        console.log('-------------')
        const url=await getSignedUrl(s3,command,{expiresIn:3600})
        console.log(url)
        return url
    }catch(error){
        throw new Error(error)
    }
}


