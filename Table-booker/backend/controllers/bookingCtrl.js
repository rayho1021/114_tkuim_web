const Reservation = require('../models/Reservation');

// 1. 查詢特定日期的名額狀況 (前端按鈕顯示)
exports.getAvailability = async (req, res) => {
  try {
    const { date } = req.query; // 接收前端傳來的日期
    const bookings = await Reservation.find({ 
      date, 
      status: { $ne: 'cancelled' } // 排除已取消的預約
    });

    // 定義所有時段 (11:00 - 20:00)
    const timeSlots = ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    
    // 計算每個時段的剩餘名額，上限5個
    const availability = timeSlots.map(slot => {
      const count = bookings.filter(b => b.timeSlot === slot).length;
      return {
        time: slot,
        remaining: 5 - count 
      };
    });

    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: '查詢失敗' });
  }
};

// 2. 新增預約
exports.createBooking = async (req, res) => {
  try {
    const { name, phone, partySize, date, timeSlot } = req.body;

    // 雙重驗證: 在存入資料庫前的最後一刻，再次檢查該時段人數
    const currentBookings = await Reservation.countDocuments({ 
      date, 
      timeSlot, 
      status: { $ne: 'cancelled' } 
    });

    if (currentBookings >= 5) {
      return res.status(400).json({ message: '抱歉，該時段剛好額滿了！' });
    }

    const newBooking = new Reservation({ name, phone, partySize, date, timeSlot });
    await newBooking.save();
    res.status(201).json({ message: '預約成功', data: newBooking });
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 3. 取得所有預約紀錄 (管理端用，含排序)
exports.getAllReservations = async (req, res) => {
  try {
    // 使用 .sort() 進行排序：日期正序 (1)，若日期相同則時段正序 (1)
    const reservations = await Reservation.find().sort({ date: 1, timeSlot: 1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: '獲取資料失敗' });
  }
};

// 4. 更新預約狀態 (報到/取消)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 從前端傳入新狀態

    // 驗證狀態是否合法
    if (!['pending', 'checked-in', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: '無效的狀態更新' });
    }

    const updatedBooking = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true } // 回傳更新後的資料
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: '找不到該筆預約' });
    }

    res.json({ message: '狀態更新成功', data: updatedBooking });
  } catch (err) {
    res.status(500).json({ message: '更新失敗' });
  }
};