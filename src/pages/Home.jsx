import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Edit3,
  Search,
  Zap,
  Smartphone,
  Bell,
  RefreshCw,
  ArrowRight,
  FileText,
  PieChart,
} from "lucide-react";

function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    // Get user role from localStorage
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hệ thống Báo cáo Marketing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Theo dõi và quản lý hiệu suất marketing với dữ liệu thời gian thực,
            báo cáo chi tiết và phân tích chuyên sâu
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <a
            href="/bao-cao-chi-tiet"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition">
              <BarChart3 className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Báo cáo chi tiết
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Phân tích chi tiết chi phí, hiệu suất và ROI theo từng chiến dịch
            </p>
            <div className="mt-4 text-blue-600 font-medium flex items-center">
              Truy cập
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
            </div>
          </a>

          <a
            href="/bao-cao-marketing"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 hover:border-green-200"
          >
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Báo cáo Marketing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Tổng quan hiệu suất marketing với các chỉ số KPI quan trọng
            </p>
            <div className="mt-4 text-green-600 font-medium flex items-center">
              Truy cập
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
            </div>
          </a>

          <a
            href="/bao-cao-hieu-suat-kpi"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 hover:border-indigo-200"
          >
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition">
              <BarChart3 className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Báo cáo hiệu suất KPI
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Phân tích chi tiết hiệu suất KPI theo từng marketing và team
            </p>
            <div className="mt-4 text-indigo-600 font-medium flex items-center">
              Truy cập
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
            </div>
          </a>

          <a
            href="/van-don"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 hover:border-teal-200"
          >
            <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition">
              <FileText className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Quản lý vận đơn
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Theo dõi và quản lý các đơn hàng vận chuyển với bộ lọc chi tiết
            </p>
            <div className="mt-4 text-teal-600 font-medium flex items-center">
              Truy cập
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
            </div>
          </a>

          {userRole === 'admin' && (
            <a
              href="/nhan-su"
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200"
            >
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quản lý nhân sự
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Theo dõi hiệu suất và quản lý đội ngũ marketing
              </p>
              <div className="mt-4 text-purple-600 font-medium flex items-center">
                Truy cập
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
              </div>
            </a>
          )}

          <a
            href="/gui-bao-cao"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 hover:border-orange-200"
          >
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-100 transition">
              <Edit3 className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Gửi báo cáo
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Gửi báo cáo marketing mới và cập nhật dữ liệu hệ thống
            </p>
            <div className="mt-4 text-orange-600 font-medium flex items-center">
              Truy cập
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" />
            </div>
          </a>
        </div>

        {/* Features Grid
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tất cả công cụ bạn cần để quản lý và tối ưu hóa chiến dịch
              marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Phân tích chi tiết
              </h3>
              <p className="text-gray-600 text-sm">
                Dữ liệu được phân tích chi tiết theo từng chiến dịch và kênh
                marketing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thời gian thực
              </h3>
              <p className="text-gray-600 text-sm">
                Cập nhật dữ liệu liên tục giúp bạn đưa ra quyết định nhanh chóng
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Giao diện hiện đại
              </h3>
              <p className="text-gray-600 text-sm">
                Thiết kế tối giản, dễ sử dụng trên mọi thiết bị
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Biểu đồ trực quan
              </h3>
              <p className="text-gray-600 text-sm">
                Trực quan hóa dữ liệu với các biểu đồ và bảng dashboard rõ ràng
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thông báo thông minh
              </h3>
              <p className="text-gray-600 text-sm">
                Nhận cảnh báo khi có sự thay đổi bất thường trong dữ liệu
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đồng bộ đa nền tảng
              </h3>
              <p className="text-gray-600 text-sm">
                Kết nối với các nền tảng quảng cáo và công cụ phân tích
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Hệ thống Báo cáo Marketing. Được thiết kế với ❤️
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
