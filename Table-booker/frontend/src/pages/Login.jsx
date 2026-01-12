import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
        if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        // 💡 加上一個小延遲或直接跳轉，確保 AdminView 渲染時能抓到新 Token
        window.location.href = '/admin'; 
        }
    } catch (err) {
      alert(err.response?.data?.message || "登入失敗");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">管理員登入</h2>
        <input 
          type="text" placeholder="帳號" className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        <input 
          type="password" placeholder="密碼" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">登入</button>
      </form>
    </div>
  );
};

export default Login;