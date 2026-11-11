const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { monthRange } = require('../utils/dates');
const found = (b, res) => b ? res.json(b) : res.status(404).json({ message: 'Budget not found' });
exports.list = async (req, res) => {
  const f = {}; if (req.query.month) f.month = +req.query.month; if (req.query.year) f.year = +req.query.year;
  res.json(await Budget.find(f).sort({ year: -1, month: -1, category: 1 }));
};
exports.get = async (req, res) => found(await Budget.findById(req.params.id), res);
exports.create = async (req, res) => res.status(201).json(await Budget.create(req.body));
exports.update = async (req, res) => found(await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }), res);
exports.remove = async (req, res) => { const b = await Budget.findByIdAndDelete(req.params.id); b ? res.json({ message: 'Budget deleted (expenses kept)' }) : res.status(404).json({ message: 'Budget not found' }); };
exports.summary = async (req, res) => {
  const now = new Date(), month = +req.query.month || now.getUTCMonth() + 1, year = +req.query.year || now.getUTCFullYear();
  const [budgets, spent] = await Promise.all([
    Budget.find({ month, year }).sort({ category: 1 }).lean(),
    Expense.aggregate([{ $match: { date: monthRange(month, year) } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }])
  ]);
  const by = Object.fromEntries(spent.map(s => [s._id, s.total]));
  const items = budgets.map(b => {
    const actual = by[b.category] || 0, usage = (actual / b.allocatedAmount) * 100;
    return { ...b, actual, remaining: b.allocatedAmount - actual, usage, status: usage > 100 ? 'over' : usage >= 80 ? 'near' : 'under' };
  });
  const budget = items.reduce((a, i) => a + i.allocatedAmount, 0), budgetedActual = items.reduce((a, i) => a + i.actual, 0);
  const totalSpent = spent.reduce((a, s) => a + s.total, 0);
  res.json({ month, year, items, totals: { budget, totalSpent, budgetedActual, remaining: budget - budgetedActual, utilization: budget ? (budgetedActual / budget) * 100 : 0 } });
};
