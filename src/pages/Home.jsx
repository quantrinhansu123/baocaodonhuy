import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  Edit3,
  FileText,
  ShoppingCart,
  DollarSign,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
      ClipboardList,
      PlusCircle,
      Factory,
    } from "lucide-react";

function Home() {
  const [userRole, setUserRole] = useState("user");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
  }, []);

  const menuItems = [
    {
      id: "home",
      label: "Menu chức năng",
      icon: <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"><div className="grid grid-cols-2 gap-0.5 w-3 h-3"><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div></div></div>,
      path: "/",
      active: location.pathname === "/" || location.pathname === "/trang-chu",
    },
    {
      id: "dashboard",
      label: "Dashboard báo cáo",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/bang-bao-cao",
      comingSoon: true,
    },
    {
      id: "crm",
      label: "Quản lý CRM/CSKH",
      icon: <Users className="w-5 h-5" />,
      path: "/quan-ly-cskh",
    },
    {
      id: "sale",
      label: "Quản lý Sale & Order",
      icon: <ShoppingCart className="w-5 h-5" />,
      path: "#",
      subItems: [
        {
          id: "order-list",
          label: "Danh sách đơn",
          icon: <ClipboardList className="w-4 h-4" />,
          path: "/danh-sach-don",
        },
            {
              id: "ffm",
              label: "FFM",
              icon: <ClipboardList className="w-4 h-4" />,
              path: "/ffm",
            },

            {
              id: "edit-order",
              label: "Chỉnh sửa đơn",
              icon: <Edit3 className="w-4 h-4" />,
              path: "#",
            },
        {
          id: "new-order",
          label: "Nhập đơn mới",
          icon: <PlusCircle className="w-4 h-4" />,
          path: "#",
        },
      ],
    },
    {
      id: "hr",
      label: "Quản lý nhân sự",
      icon: <Users className="w-5 h-5" />,
      path: "/nhan-su",
      adminOnly: true,
    },
    {
      id: "finance",
      label: "Quản lý tài chính",
      icon: <DollarSign className="w-5 h-5" />,
      path: "#",
      comingSoon: true,
    },
    {
      id: "marketing",
      label: "Quản lý marketing",
      icon: <Megaphone className="w-5 h-5" />,
      path: "/bao-cao-marketing",
    },
    {
      id: "settings",
      label: "Cài đặt hệ thống",
      icon: <Settings className="w-5 h-5" />,
      path: "#",
    },
  ];

  const contentSections = [
    {
      title: "PHÂN TÍCH & BÁO CÁO",
      items: [
        {
          title: "Dashboard báo cáo",
          icon: <BarChart3 className="w-8 h-8" />,
          color: "bg-orange-500",
          path: "/bang-bao-cao",
          status: "Sắp ra mắt",
          comingSoon: true,
        },
      ],
    },
    {
      title: "KHÁCH HÀNG & CRM",
      items: [
        {
          title: "Quản lý CRM/CSKH",
          icon: <Users className="w-8 h-8" />,
          color: "bg-blue-500",
          path: "/quan-ly-cskh",
          status: "Mở ứng dụng",
        },
        {
          title: "Đơn Chia CSKH",
          icon: <FileText className="w-8 h-8" />,
          color: "bg-cyan-500",
          path: "/don-chia-cskh",
          status: "Mở ứng dụng",
        },
      ],
    },
        {
          title: "QUẢN LÝ SALE & ORDER",
          items: [
            {
              title: "Danh sách đơn",
              icon: <ClipboardList className="w-8 h-8" />,
              color: "bg-purple-500",
              path: "/danh-sach-don",
              status: "Mở ứng dụng",
            },
        {
          title: "Chỉnh sửa đơn",
          icon: <Edit3 className="w-8 h-8" />,
          color: "bg-cyan-500",
          path: "#",
          status: "Mở ứng dụng",
        },
        {
          title: "Nhập đơn mới",
          icon: <PlusCircle className="w-8 h-8" />,
          color: "bg-purple-500",
          path: "/nhap-don",
          status: "Mở ứng dụng",
        },
      ],
    },
    {
      title: "QUẢN LÝ NHÂN SỰ",
      items: [
        {
          title: "Quản lý nhân sự",
          icon: <Users className="w-8 h-8" />,
          color: "bg-pink-500",
          path: "/nhan-su",
          status: "Mở ứng dụng",
          adminOnly: true,
        },
      ],
    },
    {
      title: "QUẢN LÝ TÀI CHÍNH",
      items: [
        {
          title: "Quản lý tài chính",
          icon: <DollarSign className="w-8 h-8" />,
          color: "bg-purple-500",
          path: "#",
          status: "Sắp ra mắt",
          comingSoon: true,
        },
      ],
    },
    {
      title: "QUẢN LÝ MARKETING",
      items: [
        {
          title: "Nhập báo cáo",
          icon: <TrendingUp className="w-8 h-8" />,
          color: "bg-green-500",
          path: "/bao-cao-marketing",
          status: "Mở ứng dụng",
        },
        {
          title: "Xem báo cáo MKT",
          icon: <BarChart3 className="w-8 h-8" />,
          color: "bg-orange-500",
          path: "/xem-bao-cao-mkt",
          status: "Mở ứng dụng",
        },
        {
          title: "Báo cáo chi tiết",
          icon: <BarChart3 className="w-8 h-8" />,
          color: "bg-blue-500",
          path: "/bao-cao-chi-tiet",
          status: "Mở ứng dụng",
        },
      ],
    },
    {
      title: "QUẢN LÝ SALE",
      items: [
        {
          title: "Báo cáo Sale",
          icon: <TrendingUp className="w-8 h-8" />,
          color: "bg-blue-600",
          path: "/bao-cao-sale",
          status: "Mở ứng dụng",
        },
      ],
    },
    {
      title: "VẬN ĐƠN",
      items: [
        {
          title: "Quản lý vận đơn",
          icon: <Package className="w-8 h-8" />,
          color: "bg-[#F37021]",
          path: "/van-don",
          status: "Mở ứng dụng",
        },
        {
          title: "FFM",
          icon: <ClipboardList className="w-8 h-8" />,
          color: "bg-indigo-500",
          path: "/ffm",
          status: "Mở ứng dụng",
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || userRole === "admin"
  );

  const filteredSections = contentSections.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.adminOnly || userRole === "admin"
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } flex flex-col sticky top-0 h-screen`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img
                src="https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2Fbe61f44f.%E1%BA%A2nh.021347.png"
                alt="Logo"
                className="h-8 object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-2">
          {filteredMenuItems.map((item) => (
            <div key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  item.active
                    ? "bg-green-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
              >
                <span className={item.active ? "text-white" : "text-gray-600"}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                )}
                {!sidebarCollapsed && item.subItems && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </Link>
              {!sidebarCollapsed && item.subItems && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1 w-6 h-6">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Menu chức năng</h1>
            </div>
          </div>

          {/* Content Sections */}
          {filteredSections.map((section, sectionIndex) => (
            section.items.length > 0 && (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-sm font-bold text-gray-700 uppercase mb-4">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 hover:border-gray-300 ${
                        item.comingSoon ? "opacity-75" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`${item.color} text-white p-3 rounded-lg flex-shrink-0`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p
                            className={`text-xs font-medium ${
                              item.comingSoon
                                ? "text-gray-400"
                                : "text-[#F37021]"
                            }`}
                          >
                            {item.status}
                          </p>
                        </div>
                        {item.comingSoon && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
