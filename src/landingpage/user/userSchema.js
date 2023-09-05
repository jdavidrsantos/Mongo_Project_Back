const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            lowercase: false,
            minLength: 1,
            validate: {
                validator: function (value) {
                    return /\d/.test(value);
                },
                message: 'Password must contain at least one digit'
            }
        },
        role: {
            type: String,
            lowercase: true,
            default: 'user'
        },
    },
    {
        collection: 'users'
    }
)
module.exports=mongoose.model( 'users', userSchema )
