const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
    quantity: {type: Number, required: true, default: 0}
}, {
    timestamps: true
})

const foodModel = mongoose.model("food", foodSchema)
module.exports = foodModel