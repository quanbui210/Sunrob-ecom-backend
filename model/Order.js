const mongoose = require('mongoose')
const singleOrderItemSchema = mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     image: {
          type: String,
          required: true
     },
     price: {
          type: Number,
          required: true
     },
     quantity: {
          type: String,
          required: true
     },
     id: {
          type: mongoose.Types.ObjectId,
          ref: 'Product'
     }
})

const OrderSchema = new mongoose.Schema({
   orderItems: {
     type: [singleOrderItemSchema],
     required: true
   },
   total: {
     type: Number,
     required: true
   },
   tax: {
     type: Number,
     required: true
   },
   subtotal: {
     type: Number,
     required: true
   },
   status: {
     type: String,
     enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
     default: 'pending'
   },
   paymentId: {
     type: String
   },
   clientSecret: {
     type: String
   },
   user: {
     type: mongoose.Types.ObjectId,
     ref: 'User',
     required: true
   }
}, {timestamps: true})

module.exports = mongoose.model('Order', OrderSchema)