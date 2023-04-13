const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name : {
        type : String
    },

    date : {
        type : Date,
        default : Date.now
    }
})

const final = mongoose.model('AgendaSchema', schema)
module.exports = final