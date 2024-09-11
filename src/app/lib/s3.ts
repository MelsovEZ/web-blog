import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateSignedUrl(fileName: string, fileType: string): Promise<{ signedRequest: string; url: string }> {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  const signedRequest = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  return { signedRequest, url };
}
