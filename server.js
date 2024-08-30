
const express = require('express');
const cors = require('cors');
const Routes = require('./routes/route');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', Routes);
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

