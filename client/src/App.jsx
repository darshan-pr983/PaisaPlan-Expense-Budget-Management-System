import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout'; import Dashboard from './pages/Dashboard'; import Expenses from './pages/Expenses'; import Budgets from './pages/Budgets';
export default function App() {
  return (<Routes><Route element={<Layout />}>
    <Route index element={<Dashboard />} /><Route path="expenses" element={<Expenses />} /><Route path="budgets" element={<Budgets />} />
    <Route path="*" element={<Navigate to="/" />} /></Route></Routes>);
}
