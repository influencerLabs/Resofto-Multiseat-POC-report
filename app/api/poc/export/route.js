import { NextResponse } from 'next/server';
import { getDatabaseBlob } from '../../../../lib/blob';
import fs from 'node:fs/promises';
import path from 'node:path';
export const runtime='nodejs';
export async function GET(){
  let buffer;
  const blob=await getDatabaseBlob();
  if(blob){ const r=await fetch(blob.downloadUrl); buffer=Buffer.from(await r.arrayBuffer()); }
  else buffer=await fs.readFile(path.join(process.cwd(),'public','seed.xlsx'));
  return new NextResponse(buffer,{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="Resofto_Aster_Multiseat_POC_Report.xlsx"'}});
}
