const express = require("express")
const path = require('path')
const app = express()

const PORT = process.env.PORT ?? 4040;


const navController = require('./server/controllers/navController')


app.use(express.static(path.join(__dirname, './client')))


app.get('/', navController.goIndex)


app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
});
