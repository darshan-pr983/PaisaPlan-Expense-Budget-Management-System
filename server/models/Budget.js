const { Schema, model } = require('mongoose');
const { CATEGORIES } = require('../utils/dates');
const s = new Schema({
  category: { type: String, required: [true, 'Category is required'], enum: { values: CATEGORIES, message: 'Invalid category' } },
  allocatedAmount: { type: Number, required: [true, 'Budget amount is required'], min: [0.01, 'Budget must be greater than zero'] },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true, min: 2000, max: 2100 }
}, { timestamps: true });
s.index({ category: 1, month: 1, year: 1 }, { unique: true });
module.exports = model('Budget', s);
