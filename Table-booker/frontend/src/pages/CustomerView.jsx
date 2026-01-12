import React, { useState, useEffect } from 'react';
import { getDateString } from '../utils'; // 記得確認你有寫這支 utils
import axios from 'axios';

const CustomerView = () => {
  const [selectedDate, setSelectedDate] = useState(getDateString(1)); // 預設明天
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', partySize: 1 });

  const tomorrow = getDateString(1);
  const dayAfter = getDateString(2);

  // 取得名額資料
  const fetchSlots = async (date) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/availability?date=${date}`);
      setAvailability(res.data);
    } catch (err) {
      alert("無法取得名額資訊");
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
    setSelectedSlot(null); // 切換日期時重置選中的時段
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        ...formData,
        date: selectedDate,
        timeSlot: selectedSlot
      });
      alert("預約成功！");
      fetchSlots(selectedDate); // 重新整理名 abroad
      setSelectedSlot(null);
      setFormData({ name: '', phone: '', partySize: 1 });
    } catch (err) {
      alert(err.response?.data?.message || "預約失敗");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Table-booker 餐廳預約</h1>
      
      {/* 日期切換 */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setSelectedDate(tomorrow)}
          className={`flex-1 py-2 rounded ${selectedDate === tomorrow ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          明天 ({tomorrow})
        </button>
        <button 
          onClick={() => setSelectedDate(dayAfter)}
          className={`flex-1 py-2 rounded ${selectedDate === dayAfter ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          後天 ({dayAfter})
        </button>
      </div>

      {/* 時段按鈕 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {availability.map((slot) => (
          <button
            key={slot.time}
            disabled={slot.remaining <= 0}
            onClick={() => setSelectedSlot(slot.time)}
            className={`p-3 border rounded-lg flex flex-col items-center transition
              ${slot.remaining <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-blue-500'}
              ${selectedSlot === slot.time ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
            `}
          >
            <span className="font-bold">{slot.time}</span>
            <span className="text-xs">剩餘名額: {slot.remaining}</span>
          </button>
        ))}
      </div>

      {/* 預約表單 */}
      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 animate-fadeIn">
          <p className="text-sm font-medium text-blue-600">您選取的時段：{selectedSlot}</p>
          <input 
            type="text" placeholder="您的姓名" required className="w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="電話號碼" required className="w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input 
            type="number" min="1" max="10" placeholder="人數" required className="w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, partySize: e.target.value})}
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">送出預約</button>
        </form>
      )}
    </div>
  );
};

export default CustomerView;