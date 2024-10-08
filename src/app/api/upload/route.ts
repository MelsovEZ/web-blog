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
    const signedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 86400 });

    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
    });
    const fileUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 86400 });

    return NextResponse.json({
      signedRequest: signedUrl,
      url: fileUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to generate signed URL', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
