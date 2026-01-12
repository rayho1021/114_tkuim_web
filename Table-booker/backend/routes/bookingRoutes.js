const express = require('express');
const router = express.Router();
const { 
  getAvailability, 
  createBooking, 
  getAllReservations, 
  updateStatus 
} = require('../controllers/bookingCtrl');

const auth = require('../middleware/auth');

router.get('/availability', getAvailability); // 顧客查詢名額
router.post('/', createBooking);               // 顧客新增預約
router.get('/admin/all', auth, getAllReservations); // 管理端查詢需要權限 
router.patch('/:id/status', auth, updateStatus);   // 管理端改狀態

module.exports = router;