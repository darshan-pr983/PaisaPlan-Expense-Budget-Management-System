require('dotenv').config(); require('express-async-errors');
const express = require('express'), cors = require('cors'), connect = require('./config/db');
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || true })); app.use(express.json());
app.use('/api', require('./routes'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(require('./middleware/errorHandler'));
connect().then(() => app.listen(process.env.PORT || 5000, () => console.log('API running'))).catch(e => { console.error(e.message); process.exit(1); });
