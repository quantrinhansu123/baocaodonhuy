import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useReportData } from "../hooks/useReportData";
import FilterPanel from "../components/FilterPanel";

export default function BaoCaoChiTiet() {
  const [userTeam, setUserTeam] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserTeam(localStorage.getItem("userTeam") || "");
    setUserRole(localStorage.getItem("userRole") || "user");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, []);

  const { masterData, allTeams, loading, error } = useReportData(userRole, userTeam, userEmail);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    products: [],
    shifts: [],
    markets: [],
    teams: [],
    searchText: "",
  });

  const [availableFilters, setAvailableFilters] = useState({
    products: [],
    shifts: ["Giữa ca", "Hết ca"],
    markets: [],
    teams: [],
  });

  const [quickSelectValue, setQuickSelectValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state for summary table
  const [summaryPage, setSummaryPage] = useState(1);
  // Pagination state for each daily table
  const [dailyPages, setDailyPages] = useState({});
  const itemsPerPage = 10;
  const maxDailyTables = 7;

  // Function to parse date strings in DD/MM/YYYY format
  const parseDate = (dateStr) => {
    if (dateStr instanceof Date) return dateStr;
    if (typeof dateStr === 'string') {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
    }
    return new Date(dateStr);
  };

  // Helper functions
  const formatNumber = (num) => {
    return num ? num.toLocaleString("vi-VN") : "0";
  };

  const formatCurrency = (num) => {
    return num ? num.toLocaleString("vi-VN") + "đ" : "0đ";
  };

  const formatPercent = (num) => {
    return (num * 100).toFixed(2) + "%";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Update available filters when masterData changes
  useEffect(() => {
    if (masterData && masterData.length > 0) {
      const products = [...new Set(masterData.map((r) => r.product).filter(Boolean))];
      const markets = [...new Set(masterData.map((r) => r.market).filter(Boolean))];

      setAvailableFilters((prev) => ({ ...prev, products: products.sort(), markets: markets.sort(), teams: allTeams }));
    }
    // when masterData is empty, reset filteredData
    setFilteredData(masterData || []);
  }, [masterData, allTeams]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (Array.isArray(value)) {
        return { ...prev, [filterType]: value };
      }

      if (Array.isArray(prev[filterType])) {
        const newValues = prev[filterType].includes(value) ? prev[filterType].filter((v) => v !== value) : [...prev[filterType], value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const handleQuickDateSelect = (e) => {
    const value = e.target.value;
    setQuickSelectValue(value);
    if (!value) return;

    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (value) {
      case "today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case "last-week": {
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        break;
      }
      case "this-week": {
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
        startDate = thisWeekStart;
        endDate = thisWeekEnd;
        break;
      }
      case "next-week": {
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() - today.getDay() + 7);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        startDate = nextWeekStart;
        endDate = nextWeekEnd;
        break;
      }
      case "this-month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        if (value.startsWith("month-")) {
          const month = parseInt(value.split("-")[1]) - 1; // 0-based
          startDate = new Date(today.getFullYear(), month, 1);
          endDate = new Date(today.getFullYear(), month + 1, 0);
        } else if (value.startsWith("q")) {
          const quarter = parseInt(value.slice(1)); // 1-4
          const quarterStartMonth = (quarter - 1) * 3;
          startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
          endDate = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
        }
        break;
    }

    setFilters((prev) => ({ ...prev, startDate: startDate.toISOString().split("T")[0], endDate: endDate.toISOString().split("T")[0] }));
  };

  const clearAllFilters = () => {
    setFilters({ startDate: "", endDate: "", products: [], shifts: [], markets: [], teams: [], searchText: "" });
    setQuickSelectValue("");
  };

  const hasActiveFilters = () => {
    return (
      filters.searchText || filters.startDate || filters.endDate || filters.products.length > 0 || filters.shifts.length > 0 || filters.markets.length > 0 || filters.teams.length > 0
    );
  };

  // Apply filters to masterData
  useEffect(() => {
    let filtered = [...(masterData || [])];

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((r) => parseDate(r.date) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => parseDate(r.date) <= endDate);
    }

    if (filters.products.length > 0) {
      filtered = filtered.filter((r) => filters.products.includes(r.product));
    }
    if (filters.shifts.length > 0) {
      filtered = filtered.filter((r) => filters.shifts.includes(r.shift));
    }
    if (filters.markets.length > 0) {
      filtered = filtered.filter((r) => filters.markets.includes(r.market));
    }
    if (filters.teams.length > 0) {
      filtered = filtered.filter((r) => r.team && filters.teams.includes(r.team));
    }

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(searchLower)) ||
          (r.email && r.email.toLowerCase().includes(searchLower)) ||
          (r.team && r.team.toLowerCase().includes(searchLower)) ||
          (r.product && r.product.toLowerCase().includes(searchLower)) ||
          (r.market && r.market.toLowerCase().includes(searchLower))
      );
    }

    setFilteredData(filtered);
  }, [filters, masterData]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const grouped = {};

    (filteredData || []).forEach((item) => {
      const key = `${item.team}_${item.name}`;
      if (!grouped[key]) {
        grouped[key] = {
          team: item.team,
          name: item.name,
          mess: 0,
          cpqc: 0,
          orders: 0,
          ordersReal: 0,
          revenue: 0,
          revenueReal: 0,
        };
      }

      grouped[key].mess += item.mess_cmt || 0;
      grouped[key].cpqc += item.cpqc || 0;
      grouped[key].orders += item.orders || 0;
      grouped[key].ordersReal += item.soDonThucTe || 0;
      grouped[key].revenue += item.revenue || 0;
      grouped[key].revenueReal += item.dsChotThucTe || 0;
    });

    const result = Object.values(grouped);

    return result;
  }, [filteredData]);

  // Group data by date for daily breakdown
  const dailyBreakdown = useMemo(() => {
    const grouped = {};

    (filteredData || []).forEach((item) => {
      if (!item.date) return; // Skip items without date

      // Ensure date is a Date object
      const dateObj =
        item.date instanceof Date ? item.date : new Date(item.date);

      // Create consistent date key (YYYY-MM-DD format for grouping)
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateObj,
          dateStr: formatDate(dateObj),
          items: [],
        };
      }
      grouped[dateKey].items.push(item);
    });

    // Sort by date descending
    const result = Object.values(grouped).sort((a, b) => b.date - a.date);

    return result;
  }, [filteredData]);

  // Calculate totals
  const totals = useMemo(() => {
    return summaryData.reduce(
      (acc, row) => ({
        mess: acc.mess + row.mess,
        cpqc: acc.cpqc + row.cpqc,
        orders: acc.orders + row.orders,
        ordersReal: acc.ordersReal + row.ordersReal,
        revenue: acc.revenue + row.revenue,
        revenueReal: acc.revenueReal + row.revenueReal,
      }),
      {
        mess: 0,
        cpqc: 0,
        orders: 0,
        ordersReal: 0,
        revenue: 0,
        revenueReal: 0,
      }
    );
  }, [summaryData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lumi-orange mx-auto"></div>
          <p className="mt-4 text-lumi-gray">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 font-bold">Lỗi khi tải dữ liệu: {String(error)}</div>
        <Link to="/bang-bao-cao" className="text-blue-600 underline mt-2 inline-block">Quay lại Bảng báo cáo</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-8 py-8 bg-white">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">← Quay lại</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Báo cáo chi tiết</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <FilterPanel
          activeTab={"detailed"}
          filters={filters}
          handleFilterChange={(type, value) => handleFilterChange(type, value)}
          quickSelectValue={quickSelectValue}
          handleQuickDateSelect={(e) => handleQuickDateSelect(e)}
          availableFilters={availableFilters}
          userRole={userRole}
          hasActiveFilters={() => hasActiveFilters()}
          clearAllFilters={() => clearAllFilters()}
        />

        <div className="lg:col-span-5">
          <div className="space-y-6">
            {/* Summary Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="bg-primary text-white text-lg font-bold px-4 py-3">
                BÁO CÁO TỔNG HỢP
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        STT
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Team
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Marketing
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Số Mess
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        CPQC
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Số Đơn
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-blue-100 uppercase border border-gray-400 whitespace-nowrap">
                        Số Đơn (TT)
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Doanh số
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-blue-100 uppercase border border-gray-400 whitespace-nowrap">
                        DS (TT)
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Tỉ lệ chốt
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-blue-100 uppercase border border-gray-400 whitespace-nowrap">
                        TL chốt (TT)
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Giá Mess
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        CPS
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        %CP/DS
                      </th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                        Giá TB Đơn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Total Row */}
                    <tr className="bg-primary text-white font-bold">
                      <td
                        className="px-2 py-2 text-xs border border-gray-400"
                        colSpan="3"
                      >
                        TỔNG CỘNG
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatNumber(totals.mess)}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatCurrency(totals.cpqc)}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatNumber(totals.orders)}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatNumber(totals.ordersReal)}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatCurrency(totals.revenue)}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatCurrency(totals.revenueReal)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center border border-gray-400">
                        {formatPercent(totals.mess ? totals.orders / totals.mess : 0)}
                      </td>
                      <td className="px-2 py-2 text-xs text-center border border-gray-400">
                        {formatPercent(
                          totals.mess ? totals.ordersReal / totals.mess : 0
                        )}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatCurrency(totals.mess ? totals.cpqc / totals.mess : 0)}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatCurrency(
                          totals.orders ? totals.cpqc / totals.orders : 0
                        )}
                      </td>
                      <td className="px-2 py-2 text-xs text-center border border-gray-400">
                        {formatPercent(
                          totals.revenue ? totals.cpqc / totals.revenue : 0
                        )}
                      </td>
                      <td className="px-2 py-2 text-xs text-right border border-gray-400">
                        {formatCurrency(
                          totals.orders ? totals.revenue / totals.orders : 0
                        )}
                      </td>
                    </tr>

                    {/* Data Rows - Paginated */}
                    {(() => {
                      const startIndex = (summaryPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedData = summaryData.slice(startIndex, endIndex);

                      return paginatedData.map((row, pageIndex) => {
                        const actualIndex = startIndex + pageIndex;
                        const closingRate = row.mess ? row.orders / row.mess : 0;
                        const closingRateReal = row.mess
                          ? row.ordersReal / row.mess
                          : 0;
                        const giaMess = row.mess ? row.cpqc / row.mess : 0;
                        const cps = row.orders ? row.cpqc / row.orders : 0;
                        const cpds = row.revenue ? row.cpqc / row.revenue : 0;
                        const giaTBDon = row.orders ? row.revenue / row.orders : 0;
                        return (
                          <tr key={actualIndex} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-xs text-center border border-gray-400">
                              {actualIndex + 1}
                            </td>
                            <td className="px-2 py-2 text-xs border border-gray-400">
                              {row.team}
                            </td>
                            <td className="px-2 py-2 text-xs border border-gray-400">
                              {row.name}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatNumber(row.mess)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatCurrency(row.cpqc)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatNumber(row.orders)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatNumber(row.ordersReal)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatCurrency(row.revenue)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatCurrency(row.revenueReal)}
                            </td>
                            <td className="px-2 py-2 text-xs text-center border border-gray-400">
                              {formatPercent(closingRate)}
                            </td>
                            <td className="px-2 py-2 text-xs text-center border border-gray-400">
                              {formatPercent(closingRateReal)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatCurrency(giaMess)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatCurrency(cps)}
                            </td>
                            <td className="px-2 py-2 text-xs text-center border border-gray-400">
                              {formatPercent(cpds)}
                            </td>
                            <td className="px-2 py-2 text-xs text-right border border-gray-400">
                              {formatCurrency(giaTBDon)}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls for Summary Table */}
              {summaryData.length > itemsPerPage && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {(summaryPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(summaryPage * itemsPerPage, summaryData.length)}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium">{summaryData.length}</span> dòng
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSummaryPage(summaryPage - 1)}
                      disabled={summaryPage === 1}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        summaryPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      ← Trước
                    </button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {(() => {
                        const totalPages = Math.ceil(
                          summaryData.length / itemsPerPage
                        );
                        return Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setSummaryPage(page)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              page === summaryPage
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ));
                      })()}
                    </div>

                    <button
                      onClick={() => setSummaryPage(summaryPage + 1)}
                      disabled={
                        summaryPage === Math.ceil(summaryData.length / itemsPerPage)
                      }
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        summaryPage === Math.ceil(summaryData.length / itemsPerPage)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Sau →
                    </button>
                  </div>
                </div>
              )}

              {summaryData.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không có dữ liệu phù hợp với bộ lọc</p>
                </div>
              )}
            </div>

            {/* Daily Breakdown Tables - Show only first 7 */}
            {dailyBreakdown.slice(0, maxDailyTables).map((dayData, dayIndex) => {
              // Calculate daily totals
              const dayTotals = dayData.items.reduce(
                (acc, item) => ({
                  mess: acc.mess + (item.mess_cmt || 0),
                  cpqc: acc.cpqc + (item.cpqc || 0),
                  orders: acc.orders + (item.orders || 0),
                  ordersReal: acc.ordersReal + (item.soDonThucTe || 0),
                  revenue: acc.revenue + (item.revenue || 0),
                  revenueReal: acc.revenueReal + (item.dsChotThucTe || 0),
                }),
                {
                  mess: 0,
                  cpqc: 0,
                  orders: 0,
                  ordersReal: 0,
                  revenue: 0,
                  revenueReal: 0,
                }
              );

              // Pagination for this day
              const currentPage = dailyPages[dayIndex] || 1;
              const totalPages = Math.ceil(dayData.items.length / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedItems = dayData.items.slice(startIndex, endIndex);

              const handlePageChange = (newPage) => {
                setDailyPages((prev) => ({ ...prev, [dayIndex]: newPage }));
              };

              return (
                <div
                  key={dayIndex}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <h3 className="bg-gray-100 text-gray-800 text-base font-bold px-4 py-3 border-b border-gray-300">
                    Ngày {dayData.dateStr} - Tổng {dayData.items.length} dòng
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            STT
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Team
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Marketing
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Sản phẩm
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Thị trường
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Ca
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Số Mess
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            CPQC
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Số Đơn
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-blue-100 uppercase border border-gray-400 whitespace-nowrap">
                            Số Đơn (TT)
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Doanh số
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-blue-100 uppercase border border-gray-400 whitespace-nowrap">
                            DS (TT)
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Tỉ lệ chốt
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-blue-100 uppercase border border-gray-400 whitespace-nowrap">
                            TL chốt (TT)
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Giá Mess
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            CPS
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            %CP/DS
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold text-white uppercase border border-gray-400 whitespace-nowrap">
                            Giá TB Đơn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="bg-green-600 text-white font-bold">
                          <td
                            className="px-2 py-2 text-xs border border-gray-400"
                            colSpan="6"
                          >
                            TỔNG NGÀY
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatNumber(dayTotals.mess)}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatCurrency(dayTotals.cpqc)}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatNumber(dayTotals.orders)}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatNumber(dayTotals.ordersReal)}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatCurrency(dayTotals.revenue)}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatCurrency(dayTotals.revenueReal)}
                          </td>
                          <td className="px-2 py-2 text-xs text-center border border-gray-400">
                            {formatPercent(
                              dayTotals.mess ? dayTotals.orders / dayTotals.mess : 0
                            )}
                          </td>
                          <td className="px-2 py-2 text-xs text-center border border-gray-400">
                            {formatPercent(
                              dayTotals.mess
                                ? dayTotals.ordersReal / dayTotals.mess
                                : 0
                            )}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatCurrency(
                              dayTotals.mess ? dayTotals.cpqc / dayTotals.mess : 0
                            )}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatCurrency(
                              dayTotals.orders ? dayTotals.cpqc / dayTotals.orders : 0
                            )}
                          </td>
                          <td className="px-2 py-2 text-xs text-center border border-gray-400">
                            {formatPercent(
                              dayTotals.revenue
                                ? dayTotals.cpqc / dayTotals.revenue
                                : 0
                            )}
                          </td>
                          <td className="px-2 py-2 text-xs text-right border border-gray-400">
                            {formatCurrency(
                              dayTotals.orders
                                ? dayTotals.revenue / dayTotals.orders
                                : 0
                            )}
                          </td>
                        </tr>

                        {paginatedItems.map((item, itemIndex) => {
                          const closingRate = item.mess_cmt ? item.orders / item.mess_cmt : 0;
                          const closingRateReal = item.mess_cmt
                            ? item.soDonThucTe / item.mess_cmt
                            : 0;
                          const giaMess = item.mess_cmt ? item.cpqc / item.mess_cmt : 0;
                          const cps = item.orders ? item.cpqc / item.orders : 0;
                          const cpds = item.revenue ? item.cpqc / item.revenue : 0;
                          const giaTBDon = item.orders ? item.revenue / item.orders : 0;
                          return (
                            <tr key={itemIndex} className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-xs text-center border border-gray-400">
                                {startIndex + itemIndex + 1}
                              </td>
                              <td className="px-2 py-2 text-xs border border-gray-400">
                                {item.team}
                              </td>
                              <td className="px-2 py-2 text-xs border border-gray-400">
                                {item.name}
                              </td>
                              <td className="px-2 py-2 text-xs border border-gray-400">
                                {item.product}
                              </td>
                              <td className="px-2 py-2 text-xs border border-gray-400">
                                {item.market}
                              </td>
                              <td className="px-2 py-2 text-xs border border-gray-400">
                                {item.shift}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatNumber(item.mess_cmt)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatCurrency(item.cpqc)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatNumber(item.orders)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatNumber(item.soDonThucTe)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatCurrency(item.revenue)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatCurrency(item.dsChotThucTe)}
                              </td>
                              <td className="px-2 py-2 text-xs text-center border border-gray-400">
                                {formatPercent(closingRate)}
                              </td>
                              <td className="px-2 py-2 text-xs text-center border border-gray-400">
                                {formatPercent(closingRateReal)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatCurrency(giaMess)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatCurrency(cps)}
                              </td>
                              <td className="px-2 py-2 text-xs text-center border border-gray-400">
                                {formatPercent(cpds)}
                              </td>
                              <td className="px-2 py-2 text-xs text-right border border-gray-400">
                                {formatCurrency(giaTBDon)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{startIndex + 1}</span>{" "}
                        đến{" "}
                        <span className="font-medium">
                          {Math.min(endIndex, dayData.items.length)}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-medium">{dayData.items.length}</span>{" "}
                        dòng
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                        >
                          ← Trước
                        </button>

                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded text-sm font-medium ${
                                  page === currentPage
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                }`}
                              >
                                {page}
                              </button>
                            )
                          )}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                        >
                          Sau →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


