import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  sold: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
