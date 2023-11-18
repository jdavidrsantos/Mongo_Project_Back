const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;
function connectToDatabase() {
    mongoose.connect(mongoURI, {
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
