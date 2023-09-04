const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            lowercase: true,
            minLength: 1,
            validate: {
                validator: function (value) {
                    return /\d/.test(value);
                },
                message: 'Password must contain at least one digit'
            }
        },
    },
    {
        collection: 'authenticate'
    }
)
module.exports=mongoose.model( 'authenticate', userSchema )




