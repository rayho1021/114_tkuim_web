const express = require('express');
const router = express.Router();
const { 
  getAvailability, 
  createBooking, 
  getAllReservations, 
  updateStatus 
} = require('../controllers/bookingCtrl');

router.get('/availability', getAvailability); // 顧客查詢名額
router.post('/', createBooking);               // 顧客新增預約
router.get('/admin/all', getAllReservations);  // 管理端看全部
router.patch('/:id/status', updateStatus);    // 管理端改狀態

module.exports = router;