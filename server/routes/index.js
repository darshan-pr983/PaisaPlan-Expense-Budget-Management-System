const r = require('express').Router();
const e = require('../controllers/expenseController'), b = require('../controllers/budgetController');
r.get('/expenses/summary', e.summary); r.route('/expenses').get(e.list).post(e.create);
r.route('/expenses/:id').get(e.get).put(e.update).delete(e.remove);
r.get('/budgets/summary', b.summary); r.route('/budgets').get(b.list).post(b.create);
r.route('/budgets/:id').get(b.get).put(b.update).delete(b.remove);
module.exports = r;
