const mongoose = require('mongoose');

function connectToDatabase() {
    mongoose.connect('mongodb://localhost:27017/ilercon', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}

module.exports = connectToDatabase;
