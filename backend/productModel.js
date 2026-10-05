const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priceCNY: { type: Number, required: true },
    imageUrl: { type: String, required: false } // We added this line!
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);