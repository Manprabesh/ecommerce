import {S3Client} from '@aws-sdk/client-s3'

export const aws_config=()=>{

    const client = new S3Client (
        {
            region:"eu-north-1",
            credentials:{
                 accessKeyId: process.env.aws_access_key_id,
                secretAccessKey: process.env.aws_secret_access_key ,
            }
        }
    )
    return client;
}