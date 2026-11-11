import { useState } from 'react';
import { Eye, Pencil, Trash2, X, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { inr, day, today, fmtDate, CATEGORIES, MONTHS, STATUS } from '../utils/format';

export const SummaryCard = ({ icon: I, label, value, tone = '#6366F1' }) => (
  <div className="card sc"><span className="ic" style={{ background: tone + '1f', color: tone }}><I size={22} /></span><div><p className="muted">{label}</p><h2>{value}</h2></div></div>);
export const Empty = ({ text }) => <div className="empty">{text}</div>;
export const Loader = () => <div className="empty">Loading…</div>;
export const ProgressBar = ({ pct, status }) => <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)}><i style={{ width: Math.min(pct, 100) + '%', background: STATUS[status].color }} /></div>;
export const Badge = ({ status }) => <span className="badge" style={{ background: STATUS[status].color + '1f', color: STATUS[status].color }}>{STATUS[status].label}</span>;
export const Modal = ({ title, onClose, children }) => (
  <div className="overlay" onClick={onClose}><div className="modal card" onClick={e => e.stopPropagation()}>
    <div className="mh"><h3>{title}</h3><button className="icon" onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</div></div>);
const Field = ({ label, error, children }) => <label className="field"><span>{label}</span>{children}{error && <em>{error}</em>}</label>;

export function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial ? { ...initial, date: day(initial.date) } : { title: '', category: '', amount: '', date: today(), description: '' });
  const [err, setErr] = useState({}), [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); const x = {};
    if (!f.title.trim()) x.title = 'Title is required'; if (!f.category) x.category = 'Select a category';
    if (!(+f.amount > 0)) x.amount = 'Amount must be greater than zero'; if (!f.date) x.date = 'Date is required';
    setErr(x); if (Object.keys(x).length) return;
    setBusy(true); try { await onSubmit({ ...f, title: f.title.trim(), amount: +f.amount }); } finally { setBusy(false); }
  };
  return (<form onSubmit={submit} className="form" noValidate>
    <Field label="Title" error={err.title}><input value={f.title} onChange={set('title')} placeholder="e.g. Weekly groceries" /></Field>
    <div className="two"><Field label="Category" error={err.category}><select value={f.category} onChange={set('category')}><option value="">Select category</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Amount (₹)" error={err.amount}><input type="number" min="0" step="0.01" value={f.amount} onChange={set('amount')} /></Field></div>
    <Field label="Date" error={err.date}><input type="date" value={f.date} onChange={set('date')} /></Field>
    <Field label="Description (optional)"><textarea rows="3" value={f.description} onChange={set('description')} /></Field>
    <div className="actions"><button type="button" className="btn ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save Expense'}</button></div></form>);
}

export function ExpenseFilters({ f, setF, onClear }) {
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (<div className="card filters">
    <div className="search"><Search size={16} /><input placeholder="Search by title" value={f.search} onChange={set('search')} /></div>
    <select value={f.category} onChange={set('category')}><option value="">All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
    <input type="month" title="Month" value={f.month} onChange={e => setF({ ...f, month: e.target.value, from: '', to: '' })} />
    <input type="date" title="From" value={f.from} onChange={e => setF({ ...f, from: e.target.value, month: '' })} />
    <input type="date" title="To" value={f.to} onChange={e => setF({ ...f, to: e.target.value, month: '' })} />
    <button className="btn ghost" onClick={onClear}>Clear filters</button></div>);
}

export const ExpenseTable = ({ items, onView, onEdit, onDelete }) => (
  <div className="scroll"><table><thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Date</th><th>Description</th><th>Actions</th></tr></thead>
    <tbody>{items.map(e => <tr key={e._id}><td><b>{e.title}</b></td><td><span className="chip">{e.category}</span></td><td>{inr(e.amount)}</td><td>{fmtDate(e.date)}</td><td className="muted clip">{e.description || '—'}</td>
      <td className="acts"><button className="icon" title="View" onClick={() => onView(e)}><Eye size={17} /></button><button className="icon" title="Edit" onClick={() => onEdit(e)}><Pencil size={17} /></button><button className="icon danger" title="Delete" onClick={() => onDelete(e)}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>);

export function BudgetForm({ initial, period, onSubmit, onCancel }) {
  const [f, setF] = useState(initial || { category: '', allocatedAmount: '', month: period.month, year: period.year });
  const [err, setErr] = useState({}), [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i);
  const submit = async e => {
    e.preventDefault(); const x = {};
    if (!f.category) x.category = 'Select a category'; if (!(+f.allocatedAmount > 0)) x.allocatedAmount = 'Budget must be greater than zero';
    setErr(x); if (Object.keys(x).length) return;
    setBusy(true); try { await onSubmit({ category: f.category, allocatedAmount: +f.allocatedAmount, month: +f.month, year: +f.year }); } finally { setBusy(false); }
  };
  return (<form onSubmit={submit} className="form" noValidate>
    <Field label="Category" error={err.category}><select value={f.category} onChange={set('category')}><option value="">Select category</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
    <Field label="Monthly budget (₹)" error={err.allocatedAmount}><input type="number" min="0" step="0.01" value={f.allocatedAmount} onChange={set('allocatedAmount')} /></Field>
    <div className="two"><Field label="Month"><select value={f.month} onChange={set('month')}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></Field>
      <Field label="Year"><select value={f.year} onChange={set('year')}>{years.map(y => <option key={y}>{y}</option>)}</select></Field></div>
    <div className="actions"><button type="button" className="btn ghost" onClick={onCancel}>Cancel</button><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save Budget'}</button></div></form>);
}

export const BudgetTable = ({ items, onEdit, onDelete }) => (
  <div className="scroll"><table><thead><tr><th>Category</th><th>Allocated Budget</th><th>Actual Expenses</th><th>Remaining Balance</th><th>Budget Usage</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>{items.map(b => <tr key={b._id} className={b.status === 'over' ? 'overrow' : ''}><td><b>{b.category}</b></td><td>{inr(b.allocatedAmount)}</td><td>{inr(b.actual)}</td>
      <td style={{ color: b.remaining < 0 ? STATUS.over.color : undefined }}>{inr(b.remaining)}</td>
      <td style={{ minWidth: 140 }}><ProgressBar pct={b.usage} status={b.status} /><small>{b.usage.toFixed(1)}%</small></td><td><Badge status={b.status} /></td>
      <td className="acts"><button className="icon" title="Edit" onClick={() => onEdit(b)}><Pencil size={17} /></button><button className="icon danger" title="Delete" onClick={() => onDelete(b)}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>);

export const BudgetChart = ({ items }) => (
  <div style={{ height: 300 }}><ResponsiveContainer><BarChart data={items.map(i => ({ name: i.category, Allocated: i.allocatedAmount, Actual: i.actual }))}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tickFormatter={v => '₹' + v.toLocaleString('en-IN')} tick={{ fontSize: 12 }} width={80} />
    <Tooltip formatter={v => inr(v)} /><Legend /><Bar dataKey="Allocated" fill="#6366F1" radius={[6, 6, 0, 0]} /><Bar dataKey="Actual" fill="#172554" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>);
