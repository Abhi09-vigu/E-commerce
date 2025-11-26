import Joi from 'joi'

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
})

export const productSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().allow('').max(2000).default(''),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().allow('').default(''),
  imageUrl: Joi.string().uri().allow(''),
  active: Joi.boolean().default(true),
  featured: Joi.boolean().default(false)
})

export const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
})

export const couponSchema = Joi.object({
  code: Joi.string().uppercase().min(3).max(20).required(),
  type: Joi.string().valid('percent','fixed').required(),
  value: Joi.number().min(0).required(),
  active: Joi.boolean().default(true),
  expiresAt: Joi.date().optional()
})
