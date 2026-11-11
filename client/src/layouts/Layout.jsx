import { useState, useCallback } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, Wallet } from 'lucide-react';
import { MONTHS } from '../utils/format';
const nav = [['/', 'Dashboard', LayoutDashboard], ['/expenses', 'Expense Management', Receipt], ['/budgets', 'Budget Management', PiggyBank]];
export default function Layout() {
  const now = new Date(), { pathname } = useLocation();
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const [toast, setT] = useState(null);
  const notify = useCallback((msg, type = 'ok') => { setT({ msg, type }); setTimeout(() => setT(null), 3200); }, []);
  const title = nav.find(n => n[0] === pathname)?.[1] || 'Dashboard';
  const years = Array.from({ length: 7 }, (_, i) => now.getFullYear() - 3 + i);
  return (<div className="shell">
    <aside className="side"><div className="brand"><Wallet size={26} /><span>Paisa<b>Plan</b></span></div>
      <nav>{nav.map(([to, l, I]) => <NavLink key={to} to={to} end={to === '/'}><I size={19} />{l}</NavLink>)}</nav></aside>
    <div className="main"><header className="top"><h1>{title}</h1>
      <div className="row"><select aria-label="Month" value={period.month} onChange={e => setPeriod({ ...period, month: +e.target.value })}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>
        <select aria-label="Year" value={period.year} onChange={e => setPeriod({ ...period, year: +e.target.value })}>{years.map(y => <option key={y}>{y}</option>)}</select>
        <div className="avatar" title="Profile">D</div></div></header>
      <main className="page"><Outlet context={{ ...period, notify }} /></main></div>
    {toast && <div className={`toast ${toast.type}`} role="status">{toast.msg}</div>}
  </div>);
}
