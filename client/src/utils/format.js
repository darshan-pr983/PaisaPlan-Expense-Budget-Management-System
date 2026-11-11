export const CATEGORIES = ['Food','Transportation','Shopping','Rent','Education','Healthcare','Entertainment','Bills & Utilities','Other'];
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const STATUS = { under: { label: 'Under Budget', color: '#16A34A' }, near: { label: 'Near Budget Limit', color: '#F59E0B' }, over: { label: 'Over Budget', color: '#DC2626' } };
export const inr = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
export const day = d => new Date(d).toISOString().slice(0, 10);               // stored dates are UTC midnight
export const today = () => new Date().toLocaleDateString('en-CA');            // local YYYY-MM-DD
export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const errMsg = e => e.response?.data?.message || e.message || 'Something went wrong';
