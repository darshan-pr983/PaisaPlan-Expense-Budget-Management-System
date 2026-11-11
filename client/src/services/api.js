import axios from 'axios';
const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
const clean = p => Object.fromEntries(Object.entries(p || {}).filter(([, v]) => v !== '' && v != null));
export const expenseApi = {
  list: p => http.get('/expenses', { params: clean(p) }).then(r => r.data),
  create: d => http.post('/expenses', d).then(r => r.data),
  update: (id, d) => http.put(`/expenses/${id}`, d).then(r => r.data),
  remove: id => http.delete(`/expenses/${id}`).then(r => r.data),
  summary: p => http.get('/expenses/summary', { params: p }).then(r => r.data)
};
export const budgetApi = {
  create: d => http.post('/budgets', d).then(r => r.data),
  update: (id, d) => http.put(`/budgets/${id}`, d).then(r => r.data),
  remove: id => http.delete(`/budgets/${id}`).then(r => r.data),
  summary: p => http.get('/budgets/summary', { params: p }).then(r => r.data)
};
