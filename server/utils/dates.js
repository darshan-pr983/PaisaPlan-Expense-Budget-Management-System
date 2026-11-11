// All dates are stored as UTC midnight; month/year ranges use UTC so no timezone drift.
exports.CATEGORIES = ['Food','Transportation','Shopping','Rent','Education','Healthcare','Entertainment','Bills & Utilities','Other'];
exports.monthRange = (m, y) => ({ $gte: new Date(Date.UTC(y, m - 1, 1)), $lt: new Date(Date.UTC(y, m, 1)) }); // m=12 rolls into next year
exports.yearRange = y => ({ $gte: new Date(Date.UTC(y, 0, 1)), $lt: new Date(Date.UTC(y + 1, 0, 1)) });
exports.parseDay = s => new Date(`${String(s).slice(0, 10)}T00:00:00.000Z`);
