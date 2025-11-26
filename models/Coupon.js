import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percent','fixed'], required: true },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date }
}, { timestamps: true })

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)
