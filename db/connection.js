const mongoose = require('mongoose');

const connectedDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to the database");
    } catch (error) {
        console.log(error);
    }
};

const disconnectedDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from the database");
    } catch (error) {
        console.log(error);
    }
};

module.exports = { connectedDB, disconnectedDB }