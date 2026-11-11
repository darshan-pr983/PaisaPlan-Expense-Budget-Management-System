import { useOutletContext } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { IndianRupee, Target, PiggyBank, Gauge, AlertTriangle } from 'lucide-react';
import useFetch from '../hooks/useFetch'; import { expenseApi, budgetApi } from '../services/api';
import { SummaryCard, Loader, Empty, BudgetChart } from '../components'; import { inr, fmtDate, MONTHS } from '../utils/format';
export default function Dashboard() {
  const { month, year } = useOutletContext();
  const { data, loading, error } = useFetch(() => Promise.all([expenseApi.summary({ month, year }), budgetApi.summary({ month, year }), expenseApi.list({ month, year })]), [month, year]);
  if (loading) return <Loader />; if (error) return <Empty text={error} />;
  const [es, bs, list] = data, t = bs.totals, over = bs.items.filter(i => i.status === 'over');
  return (<>
    <div className="grid4">
      <SummaryCard icon={IndianRupee} label="Total Monthly Expenses" value={inr(es.total)} tone="#172554" />
      <SummaryCard icon={Target} label="Total Monthly Budget" value={inr(t.budget)} />
      <SummaryCard icon={PiggyBank} label="Remaining Budget" value={inr(t.remaining)} tone={t.remaining < 0 ? '#DC2626' : '#16A34A'} />
      <SummaryCard icon={Gauge} label="Budget Utilization" value={t.utilization.toFixed(1) + '%'} tone="#F59E0B" /></div>
    <div className="grid2">
      <section className="card"><h3>Recent Expenses</h3>{list.items.length ? list.items.slice(0, 5).map(e => <div className="li" key={e._id}><div><b>{e.title}</b><p className="muted">{e.category} · {fmtDate(e.date)}</p></div><b>{inr(e.amount)}</b></div>) : <Empty text="No expenses this month. Add one under Expense Management." />}</section>
      <section className="card"><h3>Category-wise Expenses</h3>{es.byCategory.length ? es.byCategory.map(c => <div key={c.category} className="cat"><div className="li"><span>{c.category}</span><b>{inr(c.total)}</b></div><div className="bar"><i style={{ width: (c.total / es.total) * 100 + '%', background: '#6366F1' }} /></div></div>) : <Empty text="Nothing spent yet this month." />}</section></div>
    <div className="grid2">
      <section className="card"><h3>Monthly Expense Trend ({year})</h3><div style={{ height: 280 }}><ResponsiveContainer><BarChart data={es.trend.map(m => ({ name: MONTHS[m.month - 1].slice(0, 3), Expenses: m.total }))}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis width={70} tickFormatter={v => '₹' + v.toLocaleString('en-IN')} /><Tooltip formatter={v => inr(v)} /><Bar dataKey="Expenses" fill="#6366F1" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section>
      <section className="card"><h3>Budget Overview</h3>{bs.items.length ? <BudgetChart items={bs.items} /> : <Empty text="No budgets set for this month." />}</section></div>
    <section className="card"><h3>Budget Alerts</h3>{over.length ? over.map(i => <div className="alert" key={i._id}><AlertTriangle size={18} /> {i.category} is over budget by {inr(-i.remaining)} ({i.usage.toFixed(0)}% used)</div>) : <Empty text="All categories are within budget." />}</section></>);
}
