import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<CustomerView />} /> {/* 顧客預約頁面 */}
          <Route path="/login" element={<Login />} /> {/* 管理員登入頁面 */}
          <Route path="/admin" element={<AdminView />} />  {/* 管理看板 */}
          <Route path="*" element={<Navigate border="/" />} />  {/* 自動導向：如果輸入錯誤網址，回首頁 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;