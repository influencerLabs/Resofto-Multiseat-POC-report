import { NextResponse } from 'next/server';
import { getDatabaseBlob, saveDatabase } from '../../../lib/blob';
import { workbookToData, dataToWorkbook } from '../../../lib/excel';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

async function readDb() {
  const result = await getDatabaseBlob();

  if (result) {
    const chunks = [];

    for await (const chunk of result.stream) {
      chunks.push(chunk);
    }

    return workbookToData(Buffer.concat(chunks));
  }

  const seed = await fs.readFile(
    path.join(process.cwd(), 'public', 'seed.xlsx')
  );

  const data = workbookToData(seed);

  await saveDatabase(seed);

  return data;
}

export async function GET() {
  try {
    const data = await readDb();

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.data || typeof body.data !== 'object') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid workbook data.',
        },
        { status: 400 }
      );
    }

    const buffer = dataToWorkbook(body.data);

    const blob = await saveDatabase(buffer);

    return NextResponse.json({
      ok: true,
      url: blob.url,
      savedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e.message,
      },
      { status: 500 }
    );
  }
}
