import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';
import useFetch from '../hooks/useFetch'; import { budgetApi } from '../services/api';
import { BudgetForm, BudgetTable, BudgetChart, Modal, Loader, Empty } from '../components'; import { inr, errMsg, MONTHS } from '../utils/format';
export default function Budgets() {
  const period = useOutletContext(), { month, year, notify } = period, [modal, setModal] = useState(null);
  const { data, loading, error, reload } = useFetch(() => budgetApi.summary({ month, year }), [month, year]);
  const save = async d => { try { modal.item ? await budgetApi.update(modal.item._id, d) : await budgetApi.create(d); notify(modal.item ? 'Budget updated' : 'Budget saved'); setModal(null); reload(); } catch (e) { notify(errMsg(e), 'err'); } };
  const del = async b => { if (!window.confirm(`Delete the ${b.category} budget? Expenses are kept.`)) return; try { await budgetApi.remove(b._id); notify('Budget deleted'); reload(); } catch (x) { notify(errMsg(x), 'err'); } };
  const over = data?.items.filter(i => i.status === 'over') || [];
  return (<>
    <div className="bar-row"><div><h2>{MONTHS[month - 1]} {year}</h2><p className="muted">{data ? `${inr(data.totals.budgetedActual)} spent of ${inr(data.totals.budget)} budgeted` : ''}</p></div><button className="btn" onClick={() => setModal({})}><Plus size={17} /> Set Budget</button></div>
    {over.map(i => <div className="alert" key={i._id}><AlertTriangle size={18} /> Warning: {i.category} has exceeded its budget by {inr(-i.remaining)}.</div>)}
    <section className="card">{loading ? <Loader /> : error ? <Empty text={error} /> : data.items.length ? <BudgetTable items={data.items} onEdit={i => setModal({ item: i })} onDelete={del} /> : <Empty text="No budgets for this month. Use Set Budget to create one." />}</section>
    {data?.items.length > 0 && <section className="card"><h3>Allocated vs Actual</h3><BudgetChart items={data.items} /></section>}
    {modal && <Modal title={modal.item ? 'Edit Budget' : 'Set Monthly Budget'} onClose={() => setModal(null)}><BudgetForm initial={modal.item} period={period} onSubmit={save} onCancel={() => setModal(null)} /></Modal>}</>);
}
