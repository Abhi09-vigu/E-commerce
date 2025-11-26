import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  price: Number,
  quantity: Number
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], default: [] },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','paid','failed'], default: 'paid' },
  paymentRef: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
