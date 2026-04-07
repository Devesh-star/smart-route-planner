const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartroute';

app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/route'));

// Try MongoDB — gracefully fall back if unavailable
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.warn('⚠️  MongoDB offline — running without community reports:', err.message));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
