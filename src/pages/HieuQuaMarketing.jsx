import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useReportData } from "../hooks/useReportData";
import { MarketEffectivenessTab } from "../components/tabs/MarketEffectivenessTab";
import FilterPanel from "../components/FilterPanel";

export default function HieuQuaMarketing() {
  const [userTeam, setUserTeam] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserTeam(localStorage.getItem("userTeam") || "");
    setUserRole(localStorage.getItem("userRole") || "user");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, []);

  const { masterData, loading, error } = useReportData(userRole, userTeam, userEmail);
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

  // Update available filters when masterData changes
  useEffect(() => {
    if (masterData && masterData.length > 0) {
      const products = [...new Set(masterData.map((r) => r.product).filter(Boolean))];
      const markets = [...new Set(masterData.map((r) => r.market).filter(Boolean))];

      setAvailableFilters((prev) => ({ ...prev, products: products.sort(), markets: markets.sort() }));
    }
    // when masterData is empty, reset filteredData
    setFilteredData(masterData || []);
  }, [masterData]);

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
        <Link to="/" className="text-blue-600 underline mt-2 inline-block">Quay lại</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-8 py-8 bg-white">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">← Quay lại</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Hiệu quả MKT</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <FilterPanel
          activeTab={"market"}
          filters={filters}
          handleFilterChange={(type, value) => handleFilterChange(type, value)}
          quickSelectValue={quickSelectValue}
          handleQuickDateSelect={(e) => handleQuickDateSelect(e)}
          availableFilters={availableFilters}
          userRole={userRole}
          hasActiveFilters={() => hasActiveFilters()}
          clearAllFilters={() => clearAllFilters()}
          showMarkets={false}
        />

        <div className="lg:col-span-5">
          <MarketEffectivenessTab data={filteredData} filters={filters} />
        </div>
      </div>
    </div>
  );
}