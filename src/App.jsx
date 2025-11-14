import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Login from './pages/Login';
import Profile from './pages/Profile';
import VanDon from './pages/VanDon';
import ChangeLogViewer from './pages/ChangeLogViewer';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaoCaoChiTiet from './pages/BaoCaoChiTiet';
import KPIReport from './pages/KPIReport';
import HieuQuaMarketing from './pages/HieuQuaMarketing';
import BaoCaoMarketing from './pages/BaoCaoMarketing';
import F3Report from './pages/F3Report';
import NhanSu from './pages/NhanSu';
import ReportDashboard from './pages/ReportDashboard';
import BaoCaoHieuSuatKPI from './pages/BaoCaoHieuSuatKPI';

/* Header component extracted to `src/components/Header.jsx` */

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/trang-chu" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/bao-cao-chi-tiet" element={<ProtectedRoute><BaoCaoChiTiet /></ProtectedRoute>} />
          <Route path="/bang-bao-cao" element={<ProtectedRoute><ReportDashboard /></ProtectedRoute>} />
          <Route path="/bao-cao-kpi" element={<ProtectedRoute><KPIReport /></ProtectedRoute>} />
          <Route path="/hieu-qua-mkt" element={<ProtectedRoute><HieuQuaMarketing /></ProtectedRoute>} />
          <Route path="/bao-cao-marketing" element={<ProtectedRoute><BaoCaoMarketing /></ProtectedRoute>} />
          <Route path="/bao-cao-f3" element={<ProtectedRoute><F3Report /></ProtectedRoute>} />
          <Route path="/bao-cao-hieu-suat-kpi" element={<ProtectedRoute><BaoCaoHieuSuatKPI /></ProtectedRoute>} />
          <Route path="/nhan-su" element={<ProtectedRoute><NhanSu /></ProtectedRoute>} />
          <Route path="/gui-bao-cao" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
          <Route path="/ho-so" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/van-don" element={<ProtectedRoute><VanDon /></ProtectedRoute>} />
          <Route path="/lich-su-thay-doi" element={<ProtectedRoute><ChangeLogViewer /></ProtectedRoute>} />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false} 
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
