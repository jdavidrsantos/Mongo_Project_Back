const mongoose = require('mongoose')
const counterSchema = new mongoose.Schema({
        seq: {
            type: Number,
        },
            id  : {
                type: String,
            }

    },
)
module.exports=mongoose.model( 'counter', counterSchema )
