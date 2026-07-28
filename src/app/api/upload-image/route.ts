import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'png';
    const filename = `img_${timestamp}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    // Return the public URL
    const domain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || '';
    const url = domain ? `https://${domain}/uploads/${filename}` : `/uploads/${filename}`;

    return NextResponse.json({ success: true, url, filename });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
