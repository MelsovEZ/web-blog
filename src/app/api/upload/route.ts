import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Missing fileName or fileType' }, { status: 400 });
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    };

    const putCommand = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 60 });

    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
    });
    const fileUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 60 * 60 });

    return NextResponse.json({
      signedRequest: signedUrl,
      url: fileUrl,
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}
