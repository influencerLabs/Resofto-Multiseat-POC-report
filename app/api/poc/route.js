import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const runtime = 'nodejs';

const TABLES = [
  'customers','pocs','requirements','entry_checklist','exit_checklist',
  'poc_tests','poc_metrics','client_concerns','poc_signoffs'
];

async function allData() {
  const results = await Promise.all(TABLES.map((table) =>
    supabase.from(table).select('*').order('created_at', { ascending: true })
  ));
  const bad = results.find((r) => r.error);
  if (bad) throw new Error(bad.error.message);
  return Object.fromEntries(TABLES.map((t, i) => [t, results[i].data || []]));
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: await allData() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { table, record } = body || {};
    if (!TABLES.includes(table) || !record) {
      return NextResponse.json({ ok: false, error: 'Invalid table or record.' }, { status: 400 });
    }
    const { data, error } = await supabase.from(table).insert(record).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { table, id, changes } = body || {};
    if (!TABLES.includes(table) || !id || !changes) {
      return NextResponse.json({ ok: false, error: 'Invalid table, id or changes.' }, { status: 400 });
    }
    const { data, error } = await supabase.from(table).update(changes).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { table, id } = body || {};
    if (!TABLES.includes(table) || !id) {
      return NextResponse.json({ ok: false, error: 'Invalid table or id.' }, { status: 400 });
    }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
