import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

const AdminView = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. 定義抓取資料的函式
  const fetchAll = async () => {
    const token = localStorage.getItem('adminToken');
    
    // 如果沒有 Token，直接跳轉到登入頁
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/bookings/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
      setLoading(false); // 成功拿到資料，結束載入狀態
    } catch (err) {
      console.error(err);
      // 如果後端回傳 401 (Token 失效或錯誤)，清除 Token 並踢回登入頁
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/login');
      }
      setLoading(false); // 失敗也要結束載入，避免白屏
    }
  };

  // 2. 組件掛載時執行一次
  useEffect(() => {
    fetchAll();
  }, []);

  // 3. 處理狀態更新 (報到 / 取消)
  const handleStatusUpdate = async (id, newStatus) => {
    const confirmMsg = newStatus === 'checked-in' ? '已報到' : '取消';
    if (!window.confirm(`確定要將此預約更改為 ${confirmMsg} 嗎？`)) return;
    
    const token = localStorage.getItem('adminToken');

    try {
      await axios.patch(
        `http://localhost:5000/api/bookings/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } } // 💡 PATCH 也必須帶 Token
      );
      
      // 更新成功後，重新抓取最新的資料清單
      fetchAll(); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "更新失敗");
    }
  };

  // 4. 登出功能
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">載入中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Table-Booker 後台管理</h1>
          <p className="text-gray-500 mt-1">查看並管理今日與未來一天的預約紀錄</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchAll}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition font-medium"
          >
            重新整理
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
          >
            登出系統
          </button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="p-4 text-sm font-semibold uppercase tracking-wider">預約時段</th>
              <th className="p-4 text-sm font-semibold uppercase tracking-wider">顧客資訊</th>
              <th className="p-4 text-sm font-semibold uppercase tracking-wider text-center">人數</th>
              <th className="p-4 text-sm font-semibold uppercase tracking-wider text-center">狀態</th>
              <th className="p-4 text-sm font-semibold uppercase tracking-wider text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-gray-400">
                  目前尚無預約紀錄
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr key={res._id} className={`hover:bg-gray-50 transition ${res.status === 'cancelled' ? 'opacity-50 grayscale' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-blue-500" />
                      <div>
                        <div className="font-bold text-gray-800">{res.date}</div>
                        <div className="text-sm font-medium text-blue-600">{res.timeSlot}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-800">{res.name}</div>
                        <div className="text-sm text-gray-500">{res.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-700">{res.partySize} 人</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm
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
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm font-bold shadow-sm transition active:scale-95"
                        >
                          <CheckCircle size={14} /> 報到
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(res._id, 'cancelled')}
                          className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-sm font-medium transition active:scale-95"
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