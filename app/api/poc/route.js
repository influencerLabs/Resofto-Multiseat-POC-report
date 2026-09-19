import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const [
      customers,
      pocs,
      requirements,
      entry,
      exit,
      tests,
      metrics,
      concerns,
      signoffs
    ] = await Promise.all([
      supabase.from('customers').select('*').order('created_at'),
      supabase.from('pocs').select('*').order('created_at'),
      supabase.from('requirements').select('*').order('created_at'),
      supabase.from('entry_checklist').select('*').order('created_at'),
      supabase.from('exit_checklist').select('*').order('created_at'),
      supabase.from('poc_tests').select('*').order('created_at'),
      supabase.from('poc_metrics').select('*').order('created_at'),
      supabase.from('client_concerns').select('*').order('created_at'),
      supabase.from('poc_signoffs').select('*').order('created_at')
    ]);

    const results = [
      customers,
      pocs,
      requirements,
      entry,
      exit,
      tests,
      metrics,
      concerns,
      signoffs
    ];

    const failed = results.find(r => r.error);

    if (failed) {
      throw new Error(failed.error.message);
    }

    return NextResponse.json({
      ok: true,
      data: {
        customers: customers.data,
        pocs: pocs.data,
        requirements: requirements.data,
        entry_checklist: entry.data,
        exit_checklist: exit.data,
        poc_tests: tests.data,
        poc_metrics: metrics.data,
        client_concerns: concerns.data,
        poc_signoffs: signoffs.data
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
