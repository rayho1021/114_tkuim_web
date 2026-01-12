const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  partySize: { type: Number, required: true },
  date: { type: String, required: true },      // 格式: 2026-01-13
  timeSlot: { type: String, required: true },  // 格式: 11:00
  status: { 
    type: String, 
    enum: ['pending', 'checked-in', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);