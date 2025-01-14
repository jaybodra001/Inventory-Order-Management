const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  lowStockThreshold: { type: Number, default: 10 },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema); 