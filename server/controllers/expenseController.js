const Expense = require('../models/Expense');
const { monthRange, yearRange, parseDay } = require('../utils/dates');
const clean = b => ({ ...b, date: typeof b.date === 'string' && b.date ? parseDay(b.date) : b.date });
const filters = q => {
  const f = {};
  if (q.category) f.category = { $in: q.category.split(',') };
  if (q.search) f.title = new RegExp(q.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (q.month && q.year) f.date = monthRange(+q.month, +q.year);
  else if (q.from || q.to) { f.date = {}; if (q.from) f.date.$gte = parseDay(q.from); if (q.to) f.date.$lte = parseDay(q.to); }
  return f;
};
const found = (e, res) => e ? res.json(e) : res.status(404).json({ message: 'Expense not found' });
exports.list = async (req, res) => {
  const items = await Expense.find(filters(req.query)).sort({ date: -1, createdAt: -1 });
  res.json({ items, total: items.reduce((a, e) => a + e.amount, 0) });
};
exports.get = async (req, res) => found(await Expense.findById(req.params.id), res);
exports.create = async (req, res) => res.status(201).json(await Expense.create(clean(req.body)));
exports.update = async (req, res) => found(await Expense.findByIdAndUpdate(req.params.id, clean(req.body), { new: true, runValidators: true }), res);
exports.remove = async (req, res) => { const e = await Expense.findByIdAndDelete(req.params.id); e ? res.json({ message: 'Expense deleted' }) : res.status(404).json({ message: 'Expense not found' }); };
exports.summary = async (req, res) => {
  const now = new Date(), month = +req.query.month || now.getUTCMonth() + 1, year = +req.query.year || now.getUTCFullYear();
  const [cats, months] = await Promise.all([
    Expense.aggregate([{ $match: { date: monthRange(month, year) } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]),
    Expense.aggregate([{ $match: { date: yearRange(year) } }, { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } }])
  ]);
  const trend = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: months.find(m => m._id === i + 1)?.total || 0 }));
  res.json({ month, year, total: cats.reduce((a, c) => a + c.total, 0), byCategory: cats.map(c => ({ category: c._id, total: c.total })), trend });
};
