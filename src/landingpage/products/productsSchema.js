const mongoose = require('mongoose')
const productsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    price:{
        type: Number,
        min: 1,
    },
    description: String,
    category: String,

    image: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return value.includes('https://');
                },
                message: 'Image must contain "https" '
            }
            },

    rating: {
            type: Object
            },

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
},
{
    collection: 'products'
}
)
module.exports=mongoose.model( 'products', productsSchema )




