// Backup of original placeholder component
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function DonChiaCSKH() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Link
        to="/trang-chu"
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-green-700">Đơn Chia CSKH</h1>
        <p className="text-gray-600 mt-2">Quản lý và phân chia đơn hàng cho đội ngũ chăm sóc khách hàng</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tính năng đang phát triển</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Chức năng Đơn Chia CSKH đang được xây dựng. Vui lòng quay lại sau hoặc liên hệ quản trị viên để biết thêm chi tiết.
          </p>
          
          {/* Placeholder for future features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📊 Xem danh sách đơn</h3>
              <p className="text-sm text-gray-600">Theo dõi toàn bộ đơn hàng được chia cho CSKH</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">👥 Phân chia tự động</h3>
              <p className="text-sm text-gray-600">Tự động phân bổ đơn cho nhân viên CSKH</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📈 Báo cáo hiệu suất</h3>
              <p className="text-sm text-gray-600">Theo dõi tình trạng xử lý đơn hàng</p>
            </div>
          </div>

          {/* Temporary iframe embed option */}
          <div className="mt-8">
            <details className="max-w-4xl mx-auto">
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                Xem phiên bản HTML tạm thời →
              </summary>
              <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden" style={{ height: '80vh' }}>
                <iframe 
                  src="/DonchiaCSKH.html" 
                  className="w-full h-full"
                  title="Đơn Chia CSKH HTML Version"
                />
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
