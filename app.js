const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT ?? 8000;


const navController = require('./server/controllers/navController');

app.use(express.static(path.join(__dirname, './client')));

app.use(cors());
app.use(express.json());

app.get('/', navController.goIndex);


app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
});