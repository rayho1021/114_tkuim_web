import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 當網址是 / 時，顯示顧客預約頁 */}
          <Route path="/" element={<CustomerView />} />
          
          {/* 當網址是 /admin 時，顯示管理後台 */}
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;