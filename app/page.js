'use client';
import { useEffect, useMemo, useState } from 'react';

const sections = [
  ['POC Summary','Summary'],['Customer Environment','Environment'],['Customer Requirement','Requirements'],
  ['POC Entry Checklist','Entry Checklist'],['POC Exit Checklist','Exit Checklist'],['POC Report','POC Report'],
  ['Client Concerns','Concerns'],['Client Sign-off','Sign-off']
];

function cleanRows(rows){ return (rows||[]).map(r=>Array.isArray(r)?r.map(v=>v ?? ''):[]); }
function isUsefulRow(row){ return row?.some(v => String(v??'').trim() !== ''); }

export default function Home(){
  const [data,setData]=useState(null); const [active,setActive]=useState('POC Summary');
  const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState('');
  useEffect(()=>{ fetch('/api/poc').then(r=>r.json()).then(x=>{if(x.ok)setData(x.data);else setMsg(x.error)}).catch(e=>setMsg(e.message)).finally(()=>setLoading(false)); },[]);
  const save=async()=>{setSaving(true);setMsg(''); try{const r=await fetch('/api/poc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data})});const x=await r.json();if(!x.ok)throw Error(x.error);setMsg('Saved to Excel database.');}catch(e){setMsg('Save failed: '+e.message)}finally{setSaving(false)}};
  const exportExcel=()=>window.location.href='/api/poc/export';
  if(loading) return <main className="center">Loading Aster Multiseat POC…</main>;
  return <main>
    <header className="topbar"><div><div className="brand">RESOFTO</div><h1>Aster Multiseat POC Manager</h1><p>Customer POC tracking, validation, results and sign-off</p></div><div className="actions"><button onClick={save} disabled={saving}>{saving?'Saving…':'Save to Excel'}</button><button className="secondary" onClick={exportExcel}>Download Excel</button></div></header>
    {msg && <div className="toast">{msg}</div>}
    <div className="layout"><aside>{sections.map(([key,label])=><button key={key} className={active===key?'nav active':'nav'} onClick={()=>setActive(key)}>{label}</button>)}</aside><section className="content"><Dashboard data={data}/><SheetEditor name={active} data={data} setData={setData}/></section></div>
  </main>
}

function Dashboard({data}){
  const summary=data?.['POC Summary']||[]; const value=(label)=>{const row=summary.find(r=>String(r?.[0]).trim()===label);return row?.[1]||'—'};
  const counts=(sheet)=>{const rows=data?.[sheet]||[];let c={Completed:0,'In Progress':0,Blocked:0};rows.forEach(r=>{const s=String(r?.[4]||'');if(c[s]!=null)c[s]++});return c};
  const e=counts('POC Entry Checklist'), x=counts('POC Exit Checklist');
  return <div className="dashboard"><div className="card"><span>Customer</span><b>{value('Customer / Organization')}</b></div><div className="card"><span>POC Status</span><b>{value('POC Status')}</b></div><div className="card"><span>Start Date</span><b>{value('POC Start Date')}</b></div><div className="card"><span>End Date</span><b>{value('POC End Date')}</b></div><div className="mini"><span>Entry completed</span><b>{e.Completed}</b></div><div className="mini"><span>Exit completed</span><b>{x.Completed}</b></div></div>
}

function SheetEditor({name,data,setData}){
  const rows=cleanRows(data?.[name]); const [filter,setFilter]=useState('');
  const display=useMemo(()=>rows.filter((r,i)=>i<4 || !filter || r.join(' ').toLowerCase().includes(filter.toLowerCase())),[rows,filter]);
  const update=(rowIndex,col,value)=>{const copy={...data}; copy[name]=cleanRows(copy[name]); copy[name][rowIndex][col]=value; setData(copy)};
  const addRow=()=>{const copy={...data};copy[name]=[...cleanRows(copy[name]),new Array(Math.max(4,cleanRows(copy[name])[0]?.length||4)).fill('')];setData(copy)};
  return <div className="panel"><div className="panelhead"><div><h2>{name}</h2><p>Edit the workbook data directly. Changes are saved back into the Excel database.</p></div><div><input className="search" placeholder="Filter rows…" value={filter} onChange={e=>setFilter(e.target.value)}/><button className="small" onClick={addRow}>+ Add row</button></div></div><div className="tablewrap"><table><tbody>{display.map((row,displayIndex)=>{const realIndex=rows.indexOf(row); return <tr key={realIndex}>{row.map((v,c)=><td key={c}><textarea value={v} onChange={e=>update(realIndex,c,e.target.value)} /></td>)}</tr>})}</tbody></table></div><p className="hint">Tip: The first rows contain section headings in the original Excel template. You can edit them if needed.</p></div>
}
