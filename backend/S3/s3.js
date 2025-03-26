import {PutObjectCommand,GetObjectCommand,S3Client} from '@aws-sdk/client-s3'; 
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const s3=new S3Client({
    region: process.env.REGION
});
export const uploadToS3=async(bucket,key)=>{
    const command=new PutObjectCommand({
        Bucket:bucket,
        Key:key
    })
    try{
        const url=await getSignedUrl(s3,command,{expiresIn:3600})
        return url
    }catch(error){
        throw new Error(error)
    }
}

export const downloadToS3=async(bucket,key)=>{
    const command=new GetObjectCommand({
        Bucket:bucket,
        Key:key
    })
    try{
        const url=await getSignedUrl(s3,command,{expiresIn:3600})
        return url
    }catch(error){
        throw new Error(error)
    }
}


