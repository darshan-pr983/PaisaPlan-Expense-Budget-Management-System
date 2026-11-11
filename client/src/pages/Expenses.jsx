import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useFetch from '../hooks/useFetch'; import { expenseApi } from '../services/api';
import { ExpenseForm, ExpenseFilters, ExpenseTable, Modal, Loader, Empty } from '../components'; import { inr, fmtDate, errMsg } from '../utils/format';
const blank = { search: '', category: '', month: '', from: '', to: '' };
export default function Expenses() {
  const { notify } = useOutletContext();
  const [f, setF] = useState(blank), [modal, setModal] = useState(null);
  const q = { search: f.search, category: f.category, from: f.from, to: f.to, ...(f.month && { year: f.month.slice(0, 4), month: +f.month.slice(5) }) };
  const { data, loading, error, reload } = useFetch(() => expenseApi.list(q), [JSON.stringify(q)]);
  const save = async d => { try { modal.item ? await expenseApi.update(modal.item._id, d) : await expenseApi.create(d); notify(modal.item ? 'Expense updated' : 'Expense added'); setModal(null); reload(); } catch (e) { notify(errMsg(e), 'err'); } };
  const del = async e => { if (!window.confirm(`Delete "${e.title}"? This cannot be undone.`)) return; try { await expenseApi.remove(e._id); notify('Expense deleted'); reload(); } catch (x) { notify(errMsg(x), 'err'); } };
  return (<>
    <div className="bar-row"><div><h2>{data ? inr(data.total) : '—'}</h2><p className="muted">Total of {data?.items.length || 0} expenses shown</p></div><button className="btn" onClick={() => setModal({ type: 'form' })}><Plus size={17} /> Add Expense</button></div>
    <ExpenseFilters f={f} setF={setF} onClear={() => setF(blank)} />
    <section className="card">{loading ? <Loader /> : error ? <Empty text={error} /> : data.items.length ? <ExpenseTable items={data.items} onView={i => setModal({ type: 'view', item: i })} onEdit={i => setModal({ type: 'form', item: i })} onDelete={del} /> : <Empty text="No expenses found. Add an expense or adjust your filters." />}</section>
    {modal?.type === 'form' && <Modal title={modal.item ? 'Edit Expense' : 'Add Expense'} onClose={() => setModal(null)}><ExpenseForm initial={modal.item} onSubmit={save} onCancel={() => setModal(null)} /></Modal>}
    {modal?.type === 'view' && <Modal title={modal.item.title} onClose={() => setModal(null)}><dl className="dl"><dt>Category</dt><dd>{modal.item.category}</dd><dt>Amount</dt><dd>{inr(modal.item.amount)}</dd><dt>Date</dt><dd>{fmtDate(modal.item.date)}</dd><dt>Description</dt><dd>{modal.item.description || '—'}</dd></dl></Modal>}</>);
}
