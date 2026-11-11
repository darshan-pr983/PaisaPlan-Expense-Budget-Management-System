const { Schema, model } = require('mongoose');
const { CATEGORIES } = require('../utils/dates');
const s = new Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
  category: { type: String, required: [true, 'Category is required'], enum: { values: CATEGORIES, message: 'Invalid category' } },
  amount: { type: Number, required: [true, 'Amount is required'], min: [0.01, 'Amount must be greater than zero'] },
  date: { type: Date, required: [true, 'Date is required'] },
  description: { type: String, default: '', trim: true, maxlength: 500 }
}, { timestamps: true });
s.index({ date: -1 }); s.index({ category: 1, date: -1 });
module.exports = model('Expense', s);
