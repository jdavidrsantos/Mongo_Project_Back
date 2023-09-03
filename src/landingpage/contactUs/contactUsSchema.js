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
        minLength: 5,
        validate: {
            validator: function (value) {
                return value.includes('@');
            },
            message: 'Email must contain the "@" symbol'
        }
    },
    phone:{
        type: Number,
        min: 1,
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    subject: {
        type: String
    },
    message: {
        type: String
    }
},
{
    collection: 'contact_us'
}
)
module.exports=mongoose.model( 'User', userSchema )




