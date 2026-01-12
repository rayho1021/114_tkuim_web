import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react'; // 剛才安裝的圖示庫

const AdminView = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/admin/all');
      setReservations(res.data);
      setLoading(false);
    } catch (err) {
      alert("無法獲取預約資料");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`確定要將此預約更改為 ${newStatus === 'checked-in' ? '已報到' : '取消'} 嗎？`)) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus });
      fetchAll(); 
    } catch (err) {
      alert("更新失敗");
    }
  };

  if (loading) return <div className="text-center mt-20">載入中...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">後台管理看板</h1>
        <button 
          onClick={fetchAll}
          className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition"
        >
          重新整理數據
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">預約時段</th>
              <th className="p-4 text-sm font-semibold text-gray-600">顧客資訊</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">人數</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-center">狀態</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">目前尚無預約紀錄</td></tr>
            ) : (
              reservations.map((res) => (
                <tr key={res._id} className={`hover:bg-gray-50 transition ${res.status === 'cancelled' ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-500" />
                      <div>
                        <div className="font-bold text-gray-800">{res.date}</div>
                        <div className="text-sm text-blue-600">{res.timeSlot}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-800">{res.name}</div>
                        <div className="text-sm text-gray-500">{res.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-700">{res.partySize} 人</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                      ${res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        res.status === 'checked-in' ? 'bg-green-100 text-green-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {res.status === 'pending' && '待報到'}
                      {res.status === 'checked-in' && '已入座'}
                      {res.status === 'cancelled' && '已取消'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {res.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(res._id, 'checked-in')}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm shadow-sm"
                        >
                          <CheckCircle size={14} /> 報到
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(res._id, 'cancelled')}
                          className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-sm"
                        >
                          <XCircle size={14} /> 取消
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminView;