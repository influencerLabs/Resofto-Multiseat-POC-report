import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { supabase } from '../../../../lib/supabase';

export const runtime = 'nodejs';

const tables = [
  ['POC Summary','pocs'],['Customer Environment','customers'],['Customer Requirement','requirements'],
  ['POC Entry Checklist','entry_checklist'],['POC Exit Checklist','exit_checklist'],
  ['POC Report - Tests','poc_tests'],['POC Report - Metrics','poc_metrics'],
  ['Client Concerns','client_concerns'],['Client Sign-off','poc_signoffs']
];

export async function GET() {
  try {
    const wb = XLSX.utils.book_new();
    for (const [sheet, table] of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      const rows = data?.length ? data : [{ Message: 'No records yet' }];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), sheet.slice(0,31));
    }
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Resofto-Multi-Seat-POC-Report.xlsx"'
      }
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
