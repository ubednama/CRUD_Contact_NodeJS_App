const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contact.routes');
const {initDatabase} = require('./config/init.db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', contactRoutes);

app.get('/api', (req, res) => {
    res.send('API is live');
});

app.listen(PORT, () => {
    initDatabase();
    console.log(`Server is running on port ${PORT}`);
});