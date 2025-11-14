// BaoCaoHieuSuatKPI.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import FilterPanel from "../components/FilterPanel";

export default function BaoCaoHieuSuatKPI() {
  const [userTeam, setUserTeam] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userEmail, setUserEmail] = useState("");

  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cpqcByMarketing, setCpqcByMarketing] = useState({});
  const [cpqcSourceRows, setCpqcSourceRows] = useState([]);

  // Dropdown data from database
  const [products, setProducts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [shifts, setShifts] = useState([]);

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

  // Quick select value for date filter
  const [quickSelectValue, setQuickSelectValue] = useState("");

  // Column visibility states - CẬP NHẬT THEO HTML
  const [visibleColumns, setVisibleColumns] = useState({
    cpqc: true,
    chot: true,
    huy: true,
    sauHuy: true,
    di: true,
    thuTien: true,
    ship: true,
    dThuKpi: true,
    tyLeThuTien: true,
    tyLeDatKpi: true,
    cpds: true,
  });

  // Check if user can edit status
  const canEditStatus = userRole === "admin" || userRole === "leader";
  // Sau khi lấy dữ liệu F3

  useEffect(() => {
    setUserTeam(localStorage.getItem("userTeam") || "");
    setUserRole(localStorage.getItem("userRole") || "user");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, []);

  // Update available filters when data changes
  useEffect(() => {
    setAvailableFilters((prev) => ({
      ...prev,
      products: products,
      markets: markets,
      teams: teams,
      shifts: shifts,
    }));
  }, [products, markets, teams, shifts]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (Array.isArray(value)) {
        return { ...prev, [filterType]: value };
      }

      if (Array.isArray(prev[filterType])) {
        const newValues = prev[filterType].includes(value)
          ? prev[filterType].filter((v) => v !== value)
          : [...prev[filterType], value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // Format date for filter (YYYY-MM-DD) without timezone issues
  const formatDateForFilter = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
        // Tìm Thứ Hai của tuần trước
        const lastWeekMonday = new Date(today);
        const daysToSubtract = ((today.getDay() + 6) % 7) + 7; // +7 để về tuần trước
        lastWeekMonday.setDate(today.getDate() - daysToSubtract);

        const lastWeekEnd = new Date(lastWeekMonday);
        lastWeekEnd.setDate(lastWeekMonday.getDate() + 6); // Chủ Nhật tuần trước

        startDate = lastWeekMonday;
        endDate = lastWeekEnd;
        break;
      }
      case "this-week": {
        // Tìm Thứ Hai của tuần này
        const thisWeekMonday = new Date(today);
        const daysToSubtract = (today.getDay() + 6) % 7;
        thisWeekMonday.setDate(today.getDate() - daysToSubtract);

        const thisWeekEnd = new Date(thisWeekMonday);
        thisWeekEnd.setDate(thisWeekMonday.getDate() + 6); // Chủ Nhật tuần này

        startDate = thisWeekMonday;
        endDate = thisWeekEnd;
        break;
      }
      case "next-week": {
        // Tìm Thứ Hai của tuần sau
        const nextWeekMonday = new Date(today);
        const daysToAdd = (8 - today.getDay()) % 7; // Tính số ngày đến Thứ Hai tuần sau
        if (daysToAdd === 0) daysToAdd = 7; // Nếu hôm nay là Thứ Hai, thì tuần sau là 7 ngày sau
        nextWeekMonday.setDate(today.getDate() + daysToAdd);

        const nextWeekEnd = new Date(nextWeekMonday);
        nextWeekEnd.setDate(nextWeekMonday.getDate() + 6); // Chủ Nhật tuần sau

        startDate = nextWeekMonday;
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

    setFilters((prev) => ({
      ...prev,
      startDate: formatDateForFilter(startDate),
      endDate: formatDateForFilter(endDate),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      products: [],
      shifts: [],
      markets: [],
      teams: [],
      searchText: "",
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchText ||
      filters.startDate ||
      filters.endDate ||
      filters.products.length > 0 ||
      filters.shifts.length > 0 ||
      filters.markets.length > 0 ||
      filters.teams.length > 0
    );
  };

  // Fetch Firebase data
  const fetchFirebaseData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching data from Firebase F3 and API...");

      const F3_URL =
        "https://lumi-6dff7-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet/F3.json";
      const API_URL =
        "https://n-api-gamma.vercel.app/report/generate?tableName=Báo cáo MKT";

      // Fetch both data sources in parallel
      const [f3Response, apiResponse] = await Promise.all([
        fetch(F3_URL),
        fetch(API_URL),
      ]);

      let f3Data = [];
      let cpqcByMarketing = {};
      let cpqcSourceRows = [];

      // Process F3 data
      try {
        f3Data = await f3Response.json();
        console.log(
          `✅ F3 Data loaded: ${
            Array.isArray(f3Data) ? f3Data.length : 0
          } records`
        );
      } catch (f3Error) {
        console.warn("Error fetching F3 data:", f3Error);
      }

      const testData = f3Data.map((item) => ({
        ten: item["Nhân viên Marketing"],
        ca: item["Ca"],
        ngay: item["Ngày lên đơn"],
      }));
            
      const filteredTestData = testData.filter(item => {
        const date = new Date(item.ngay);
        const month = date.getMonth();
        const day = date.getDate();
        return month === 8 && day >= 1 && day <= 30; // Tháng 9 (September)
      });
      
      console.log("Filtered data - Thang 9:", filteredTestData);

      // Process API data for CPQC
      try {
        const apiData = await apiResponse.json();
        console.log("API Data raw:", apiData);
        console.log(
          `✅ API Data loaded: ${
            Array.isArray(apiData)
              ? apiData.length
              : Object.keys(apiData || {}).length
          } records`
        );

        // Build CPQC map from API data
        if (apiData && typeof apiData === "object") {
          const apiArrays = [];
          Object.keys(apiData).forEach((key) => {
            if (Array.isArray(apiData[key])) {
              apiArrays.push({ name: key, data: apiData[key] });
            }
          });

          console.log("API Arrays found:", apiArrays.length);

          apiArrays.forEach(({ data: arr }) => {
            arr.forEach((row) => {
              if (!row || typeof row !== "object") return;
              const nameRaw =
                row["Tên"] || row["ten"] || row["name"] || row["hoten"] || "";
              const marketingName = String(nameRaw).trim();
              const cpqcValue = Number(row["CPQC"] ?? row["cpqc"] ?? 0) || 0;
              const ngayStr = row["Ngày"] || row["ngay"] || "";
              const ngay = ngayStr ? new Date(ngayStr) : null;

              if (marketingName && cpqcValue > 0) {
                cpqcByMarketing[marketingName] =
                  (cpqcByMarketing[marketingName] || 0) + cpqcValue;
                cpqcSourceRows.push({
                  ten: marketingName,
                  ngay,
                  cpqc: cpqcValue,
                });
              }
            });
          });
        }

        console.log(
          `🗂️ CPQC collected for ${
            Object.keys(cpqcByMarketing).length
          } marketing names`
        );
        console.log("CPQC Source Rows:", cpqcSourceRows.length);
      } catch (apiError) {
        console.warn("Error fetching API data:", apiError);
      }

      // Process F3 data into masterData
      const processedData = Array.isArray(f3Data)
        ? f3Data
            .filter((o) => o && o["Nhân viên Marketing"])
            .map((order) => {
              const marketing = String(order["Nhân viên Marketing"]).trim();
              const team = order["Team"] || "Khác";
              const ngayLenDonRaw = order["Ngày lên đơn"];
              const ngay = ngayLenDonRaw ? new Date(ngayLenDonRaw) : new Date();
              const sanPham = order["Mặt hàng"] || "N/A";
              const thiTruong = order["Khu vực"] || "N/A";
              const ketQuaCheck = order["Kết quả Check"] || "";
              const maTracking = String(order["Mã Tracking"] || "").trim();
              const tongTien = Number(order["Tổng tiền VNĐ"]) || 0;
              const phiShip = Number(order["Phí ship"]) || 0;
              const doiSoatRaw = order["Tiền Việt đã đối soát"];
              const tienVietDoiSoat =
                typeof doiSoatRaw === "number"
                  ? doiSoatRaw
                  : Number(doiSoatRaw) || 0;

              // Phân loại đơn
              const isHuy = ketQuaCheck === "Huỷ";
              const isDi = maTracking !== "";
              const isThanhCong = ketQuaCheck === "OK" && isDi;

              // Calculate metrics following HTML logic
              const soDonThucTe = 1;
              const dsChotThucTe = tongTien;
              const soDonHuyThucTe = isHuy ? 1 : 0;
              const dsHoanHuyThucTe = isHuy ? tongTien : 0;
              const dsSauHoanHuyThucTe = isHuy ? 0 : tongTien;
              const dsThanhCongThucTe = isThanhCong ? tongTien : 0;
              const soDonThanhCongThucTe = isThanhCong ? 1 : 0;
              const soDonThuTienThucTe = tienVietDoiSoat > 0 ? 1 : 0;
              const dThuThanhCongThucTe = tienVietDoiSoat;

              return {
                ten: marketing,
                team,
                ngay,
                sanPham,
                thiTruong,
                ca: order["Ca"] || "N/A",
                isHuy: isHuy,
                // Legacy fields for compatibility
                dsChot: tongTien,
                ship: phiShip,
                cpqc: 0, // Will be set from CPQC map
                soDon: 1,
                soDonHuy: soDonHuyThucTe,
                doanhSoHuy: dsHoanHuyThucTe,
                dsSauHoanHuy: dsSauHoanHuyThucTe,
                dsThanhCong: dsThanhCongThucTe,
                soDonThanhCong: soDonThanhCongThucTe,
                soDonThuTien: soDonThuTienThucTe,
                dThuThanhCong: dThuThanhCongThucTe,
                // New detailed fields matching HTML logic
                soDonThucTe,
                dsChotThucTe,
                soDonHuyThucTe,
                dsHoanHuyThucTe,
                dsSauHoanHuyThucTe,
                dsThanhCongThucTe,
                soDonThuTienThucTe,
                dThuThanhCongThucTe,
              };
            })
        : [];

      setMasterData(processedData);
      setCpqcByMarketing(cpqcByMarketing);
      setCpqcSourceRows(cpqcSourceRows);

      console.log(`✅ Master data created: ${processedData.length} records`);
    } catch (err) {
      console.error("Error fetching Firebase data:", err);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const F3_URL =
        "https://lumi-6dff7-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet/F3.json";
      const response = await fetch(F3_URL);
      const data = await response.json();
      const productsSet = new Set();
      const teamsSet = new Set();
      const marketsSet = new Set();
      const shiftsSet = new Set();
      data.forEach((item) => {
        if (item["Mặt hàng"]) productsSet.add(String(item["Mặt hàng"]).trim());
        if (item["Team"]) teamsSet.add(String(item["Team"]).trim());
        if (item["Khu vực"]) marketsSet.add(String(item["Khu vực"]).trim());
        if (item["Ca"]) shiftsSet.add(String(item["Ca"]).trim());
      });
      setProducts(Array.from(productsSet).sort());
      setTeams(Array.from(teamsSet).sort());
      setMarkets(Array.from(marketsSet).sort());
      setShifts(Array.from(shiftsSet).sort());
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  useEffect(() => {
    fetchFirebaseData();
  }, []);

  useEffect(() => {
    fetchFilterData();
  }, []);

  // Load unique products from Firebase reports only
  const loadProductsFromFirebase = (data) => {
    try {
      const productsSet = new Set();
      data.forEach((item) => {
        if (item.sanPham && String(item.sanPham).trim()) {
          productsSet.add(String(item.sanPham).trim());
        }
      });
      setProducts(Array.from(productsSet).sort());
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Load unique teams from Firebase reports only
  const loadTeamsFromFirebase = (data) => {
    try {
      const teamsSet = new Set();
      data.forEach((item) => {
        if (item.team && String(item.team).trim()) {
          teamsSet.add(String(item.team).trim());
        }
      });
      setTeams(Array.from(teamsSet).sort());
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  // Load unique markets from Firebase reports only
  const loadMarketsFromFirebase = (data) => {
    try {
      const marketsSet = new Set();
      data.forEach((item) => {
        if (item.thiTruong && String(item.thiTruong).trim()) {
          marketsSet.add(String(item.thiTruong).trim());
        }
      });
      setMarkets(Array.from(marketsSet).sort());
    } catch (error) {
      console.error("Error loading markets:", error);
    }
  };

  // Load unique shifts from Firebase reports only
  const loadShiftsFromFirebase = (data) => {
    try {
      const shiftsSet = new Set();
      data.forEach((item) => {
        if (item["Ca"] && String(item["Ca"]).trim()) {
          shiftsSet.add(String(item["Ca"]).trim());
        }
      });
      setShifts(Array.from(shiftsSet).sort());
    } catch (error) {
      console.error("Error loading shifts:", error);
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...masterData];

    // Apply role-based filtering
    if (userRole === "admin") {
      // Admin sees all
    } else if (userRole === "leader" && userTeam) {
      // Leader sees their team's reports
      filtered = filtered.filter((r) => r.team === userTeam);
    } else if (userEmail) {
      // Regular user sees only their reports
      filtered = filtered.filter((r) =>
        r.ten.toLowerCase().includes(userEmail.toLowerCase())
      );
    }

    // Search by text (name)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (report) => report.ten && report.ten.toLowerCase().includes(searchLower)
      );
    }

    // Date filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter((report) => {
        if (!report.ngay) return false;
        const reportDate = new Date(report.ngay);

        if (filters.startDate) {
          const start = new Date(filters.startDate);
          start.setHours(0, 0, 0, 0);
          if (reportDate < start) return false;
        }

        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          if (reportDate > end) return false;
        }

        return true;
      });
    }

    // Product filter
    if (filters.products && filters.products.length > 0) {
      filtered = filtered.filter((report) =>
        filters.products.includes(report.sanPham)
      );
    }

    // Shift filter
    if (filters.shifts && filters.shifts.length > 0) {
      filtered = filtered.filter((report) =>
        filters.shifts.includes(report.ca)
      );
    }

    // Market filter
    if (filters.markets && filters.markets.length > 0) {
      filtered = filtered.filter((report) =>
        filters.markets.includes(report.thiTruong)
      );
    }

    // Team filter
    if (filters.teams && filters.teams.length > 0) {
      filtered = filtered.filter((report) =>
        filters.teams.includes(report.team)
      );
    }

    return filtered;
  }, [masterData, filters, userRole, userTeam, userEmail]);

  // Generate KPI table data
  const kpiData = useMemo(() => {
    // Tính CPQC theo khoảng ngày đang lọc
    let filteredCpqcByMarketing = cpqcByMarketing;
    try {
      const startDateVal = filters.startDate;
      const endDateVal = filters.endDate;
      const rows = Array.isArray(cpqcSourceRows) ? cpqcSourceRows : [];

      console.log(`🗓️ Lọc CPQC: ${startDateVal} đến ${endDateVal}`);
      console.log(`📋 Tổng CPQC source rows: ${rows.length}`);

      if (rows.length && startDateVal && endDateVal) {
        const s = new Date(startDateVal);
        s.setHours(0, 0, 0, 0);
        const e = new Date(endDateVal);
        e.setHours(23, 59, 59, 999);
        const map = {};
        let filteredTotal = 0;
        let filteredCount = 0;
        let outsideDateRange = 0;

        rows.forEach((r) => {
          if (!r || !r.ngay) {
            // Records không có ngày vẫn được tính (có thể là dữ liệu quan trọng)
            if (r && r.ten && r.cpqc) {
              map[r.ten] = (map[r.ten] || 0) + (Number(r.cpqc) || 0);
              filteredTotal += Number(r.cpqc) || 0;
              filteredCount++;
            }
            return;
          }
          const d = new Date(r.ngay);
          // Kiểm tra ngày hợp lệ
          if (isNaN(d.getTime())) {
            console.warn("Invalid date in CPQC record:", r.ngay, r);
            return;
          }
          if (d >= s && d <= e) {
            map[r.ten] = (map[r.ten] || 0) + (Number(r.cpqc) || 0);
            filteredTotal += Number(r.cpqc) || 0;
            filteredCount++;
          } else {
            outsideDateRange++;
          }
        });

        console.log(
          `✅ CPQC sau lọc ngày: ${filteredTotal.toLocaleString()} (${filteredCount} records)`
        );
        console.log(`❌ CPQC ngoài khoảng: ${outsideDateRange} records`);
        console.log(`👥 Marketing có CPQC: ${Object.keys(map).length} người`);

        // So sánh với tổng ban đầu
        const originalTotal = Object.values(cpqcByMarketing || {}).reduce(
          (sum, val) => sum + val,
          0
        );
        const difference = originalTotal - filteredTotal;
        if (difference > 0) {
          console.warn(
            `⚠️ Chênh lệch CPQC: ${difference.toLocaleString()} (gốc: ${originalTotal.toLocaleString()}, lọc: ${filteredTotal.toLocaleString()})`
          );
        }

        filteredCpqcByMarketing = map; // cập nhật map cho lần render này
      }
    } catch (e) {
      console.warn("Không thể lọc CPQC theo ngày:", e);
    }

    const summary = {};
    const cpqcMap = filteredCpqcByMarketing || {};

    // Debug: Track CPQC usage
    let totalCpqcFromMap = Object.values(cpqcMap).reduce(
      (sum, val) => sum + (Number(val) || 0),
      0
    );
    let cpqcUsed = 0;
    const cpqcUsageTracker = {};

    console.log(
      `🔧 generateKpiTableData: CPQC map có ${
        Object.keys(cpqcMap).length
      } entries, tổng: ${totalCpqcFromMap.toLocaleString()}`
    );

    filteredData.forEach((r) => {
      const key = r.ten || "N/A";
      if (!summary[key]) {
        const cpqcValue = cpqcMap[key] || 0;
        if (!cpqcUsageTracker[key] && cpqcValue > 0) {
          cpqcUsageTracker[key] = cpqcValue;
          cpqcUsed += cpqcValue;
        }
        summary[key] = {
          name: r.ten,
          team: r.team,
          cpqc: cpqcValue,
          // Dữ liệu chốt
          soDonChot: 0,
          dsChot: 0,
          // Dữ liệu hủy
          soDonHuy: 0,
          dsHuy: 0,
          // Dữ liệu sau hủy
          soDonSauHuy: 0,
          dsSauHuy: 0,
          // Dữ liệu đi (có mã tracking)
          soDonDi: 0,
          dsDi: 0,
          // Dữ liệu thu tiền thành công
          soDonThuTien: 0,
          dThuThanhCong: 0,
          // Ship và KPI
          ship: 0,
          dThuTinhKpi: 0,
          kpiValue: 0,
          // Thống kê nguồn số liệu
          dsSauHuySourceTT: 0,
          dsSauHuySourceFB: 0,
          // Giữ lại dữ liệu cũ để tương thích
          soDonHuyOld: 0,
          doanhSoHuy: 0,
          dsSauShip: 0,
          dsThanhCong: 0,
          dsChotThucTe: 0,
          soDonHuyThucTe: 0,
          dsHoanHuyThucTe: 0,
          dsSauHoanHuyThucTe: 0,
          dsThanhCongThucTe: 0,
        };
      }
      const S = summary[key];
      // Không cộng dồn cpqc theo record để tránh mất CPQC khi lọc ngày; giữ nguyên giá trị map

      // Tổng hợp dữ liệu mới - TẤT CẢ SỐ ĐƠN DÙNG soDonThucTe
      const soDonThucTe = Number(r.soDonThucTe) || 0;
      const dsChotBase = Number(r.dsChotThucTe) || Number(r.dsChot) || 0;
      const dsSauHoanHuyTT = Number(r.dsSauHoanHuyThucTe) || 0;
      const dsSauHoanHuyAPI = Number(r.dsSauHoanHuy) || 0;
      const dsSauHoanHuyBase = dsSauHoanHuyTT || dsSauHoanHuyAPI;
      // DS hủy lấy từ DS Hoàn Hủy (dsHoanHuyThucTe)
      const dsHuyVal = Number(r.dsHoanHuyThucTe) || 0;
      const soDonHuyThucTe = Number(r.soDonHuyThucTe) || 0;

      S.soDonChot += soDonThucTe;
      S.dsChot += dsChotBase;
      S.soDonHuy += soDonHuyThucTe;
      // DS hủy lấy giá trị từ DS Hoàn Hủy
      S.dsHuy += dsHuyVal;
      // Số đơn sau hủy = số đơn thực tế - số đơn hủy thực tế
      S.soDonSauHuy += Math.max(0, soDonThucTe - soDonHuyThucTe);
      // DS sau hủy = DS chốt - DS hủy
      // (Không cộng trực tiếp ở đây vì sẽ tính lại sau khi tổng hợp xong)
      // Ghi nhận nguồn số DS sau hủy cho tooltip
      if (dsSauHoanHuyTT > 0) {
        S.dsSauHuySourceTT += 1;
      } else if (dsSauHoanHuyAPI > 0) {
        S.dsSauHuySourceFB += 1;
      } else {
        // cả hai = 0: coi là fallback (0)
        S.dsSauHuySourceFB += 1;
      }
      // Số đơn & DS đi (cùng logic: chỉ đơn OK + có tracking)
      S.soDonDi += r.soDonThanhCongThucTe || 0;
      S.dsDi += r.dsThanhCongThucTe || r.dsThanhCong || 0;
      // Số đơn & DThu thành công lấy từ Tiền Việt đã đối soát
      S.soDonThuTien += r.soDonThuTienThucTe || 0;
      S.dThuThanhCong += r.dThuThanhCongThucTe || 0;
      if (!r.isHuy) {
        S.ship += r.ship || 0; // Phí ship từ F3 data - field 'Phí ship' chỉ cho đơn không hủy
      }
      // DThu tính KPI sẽ tính sau = DS sau hủy - Ship

      // Giữ lại dữ liệu cũ
      S.dsSauShip += r.dsSauShip;
      S.dsThanhCong += r.dsThanhCong;
      S.kpiValue += r.kpiValue;
      S.soDonHuyOld += r.soDonHuy;
      S.doanhSoHuy += r.doanhSoHuy;
      S.dsChotThucTe += r.dsChotThucTe;
      S.soDonHuyThucTe += r.soDonHuyThucTe;
      S.dsHoanHuyThucTe += r.dsHoanHuyThucTe;
      S.dsSauHoanHuyThucTe += r.dsSauHoanHuyThucTe;
      S.dsThanhCongThucTe += r.dsThanhCongThucTe;
    });
    // CRITICAL FIX: Thêm marketing có CPQC nhưng không có đơn F3
    Object.entries(cpqcMap).forEach(([marketingName, cpqcValue]) => {
      if (cpqcValue > 0 && !summary[marketingName]) {
        console.log(
          `➕ Adding CPQC-only marketing: ${marketingName} = ${cpqcValue.toLocaleString()}`
        );
        summary[marketingName] = {
          name: marketingName,
          team: "N/A", // Không có thông tin team từ F3
          cpqc: cpqcValue,
          // Tất cả metrics khác = 0 vì không có đơn hàng
          soDonChot: 0,
          dsChot: 0,
          soDonHuy: 0,
          dsHuy: 0,
          soDonSauHuy: 0,
          dsSauHuy: 0,
          soDonDi: 0,
          dsDi: 0,
          soDonThuTien: 0,
          dThuThanhCong: 0,
          ship: 0,
          dThuTinhKpi: 0,
          kpiValue: 0,
          dsSauHuySourceTT: 0,
          dsSauHuySourceFB: 0,
          soDonHuyOld: 0,
          doanhSoHuy: 0,
          dsSauShip: 0,
          dsThanhCong: 0,
          dsChotThucTe: 0,
          soDonHuyThucTe: 0,
          dsHoanHuyThucTe: 0,
          dsSauHoanHuyThucTe: 0,
          dsThanhCongThucTe: 0,
        };
        cpqcUsed += cpqcValue;
        if (!cpqcUsageTracker[marketingName]) {
          cpqcUsageTracker[marketingName] = cpqcValue;
        }
      }
    });

    // Tính DS sau hủy và DThu tính KPI cho tất cả các mục
    const result = Object.values(summary).map((s) => {
      s.dsSauHuy = Math.max(0, s.dsChot - s.dsHuy);
      // DThu tính KPI = DS sau hủy - Ship (cho phép âm nếu Ship > DS sau hủy)
      s.dThuTinhKpi = (s.dsSauHuy || 0) - (s.ship || 0);
      return s;
    });

    console.log(
      "Ship data:",
      result.map((item) => ({ name: item.name, ship: item.ship }))
    );

    // Debug: Final CPQC usage summary
    const finalCpqcTotal = result.reduce((sum, s) => sum + (s.cpqc || 0), 0);
    const cpqcNotUsed = totalCpqcFromMap - cpqcUsed;
    const unusedCpqcEntries = Object.entries(cpqcMap).filter(
      ([name, value]) => !cpqcUsageTracker[name] && value > 0
    );

    console.log(`📊 CPQC Usage Summary:`);
    console.log(`   - CPQC từ map: ${totalCpqcFromMap.toLocaleString()}`);
    console.log(`   - CPQC đã dùng: ${cpqcUsed.toLocaleString()}`);
    console.log(`   - CPQC không dùng: ${cpqcNotUsed.toLocaleString()}`);
    console.log(`   - CPQC trong result: ${finalCpqcTotal.toLocaleString()}`);
    console.log(`   - Số marketing không khớp:`, unusedCpqcEntries.length);
    if (unusedCpqcEntries.length > 0) {
      console.log(
        `   - Tên không khớp:`,
        unusedCpqcEntries
          .slice(0, 10)
          .map(([name, val]) => `"${name}": ${val.toLocaleString()}`)
      );
    }

    return result;
  }, [
    filteredData,
    cpqcByMarketing,
    cpqcSourceRows,
    filters.startDate,
    filters.endDate,
  ]);

  // Calculate totals with percentages
  const totals = useMemo(() => {
    const total = kpiData.reduce(
      (acc, item) => {
        acc.cpqc += item.cpqc || 0;
        acc.soDonChot += item.soDonChot || 0;
        acc.dsChot += item.dsChot || 0;
        acc.soDonHuy += item.soDonHuy || 0;
        acc.dsHuy += item.dsHuy || 0;
        acc.soDonSauHuy += item.soDonSauHuy || 0;
        acc.dsSauHuy += item.dsSauHuy || 0;
        acc.soDonDi += item.soDonDi || 0;
        acc.dsDi += item.dsDi || 0;
        acc.soDonThuTien += item.soDonThuTien || 0;
        acc.dThuThanhCong += item.dThuThanhCong || 0;
        acc.ship += item.ship || 0;
        acc.dThuTinhKpi += item.dThuTinhKpi || 0;
        return acc;
      },
      {
        cpqc: 0,
        soDonChot: 0,
        dsChot: 0,
        soDonHuy: 0,
        dsHuy: 0,
        soDonSauHuy: 0,
        dsSauHuy: 0,
        soDonDi: 0,
        dsDi: 0,
        soDonThuTien: 0,
        dThuThanhCong: 0,
        ship: 0,
        dThuTinhKpi: 0,
      }
    );

    // Calculate percentages
    total.tyLeThuTien = total.dsDi > 0 ? total.dThuThanhCong / total.dsDi : 0;
    total.cpds = total.dsSauHuy > 0 ? total.cpqc / total.dsSauHuy : 0;

    return total;
  }, [kpiData]);

  // Format functions
  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("vi-VN");
  };

  const formatPercent = (value) => {
    if (!isFinite(value)) return "0.00%";
    return `${(Number(value || 0) * 100).toFixed(2)}%`;
  };

  return (
    <div className="mx-auto px-8 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <FilterPanel
          activeTab="kpi"
          filters={filters}
          handleFilterChange={handleFilterChange}
          quickSelectValue={quickSelectValue}
          handleQuickDateSelect={handleQuickDateSelect}
          availableFilters={availableFilters}
          userRole={userRole}
          hasActiveFilters={hasActiveFilters}
          clearAllFilters={clearAllFilters}
        />

        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-6 pt-6">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-800 flex-shrink-0 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Link>
              <h2 className="text-2xl font-bold text-primary uppercase text-center flex-1">
                Báo cáo hiệu suất KPI
              </h2>
              <button
                onClick={fetchFirebaseData}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition flex-shrink-0 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Search bar above table */}
            <div className="px-6 mb-4">
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={filters.searchText || ""}
                  onChange={(e) =>
                    handleFilterChange("searchText", e.target.value)
                  }
                  placeholder="Tìm kiếm tên marketing..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Column Controls */}
            <div className="px-6 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">
                  Tùy chọn hiển thị cột:
                </h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.cpqc}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          cpqc: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    CPQC
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.chot}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          chot: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Số đơn & DS chốt
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.huy}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          huy: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Số đơn & DS hủy
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.sauHuy}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          sauHuy: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Số đơn & DS sau hủy
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.di}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          di: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Số đơn & DS đi
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.thuTien}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          thuTien: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Số đơn & DThu thành công
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ship}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          ship: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Ship
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.dThuKpi}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          dThuKpi: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    DThu tính KPI
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.tyLeThuTien}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          tyLeThuTien: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Tỷ lệ thu tiền
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.tyLeDatKpi}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          tyLeDatKpi: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    Tỷ lệ đạt KPI
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={visibleColumns.cpds}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          cpds: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    %CP/DS
                  </label>
                </div>
              </div>
            </div>

            {kpiData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Chưa có dữ liệu KPI</p>
                <p className="text-gray-400 text-sm mt-2">
                  Hãy kiểm tra dữ liệu từ Firebase
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600 px-6">
                  Hiển thị:{" "}
                  <span className="font-semibold text-primary">
                    {kpiData.length}
                  </span>{" "}
                  marketing
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-secondary">
                      <tr>
                        <th
                          rowSpan="2"
                          className="px-1.5 py-1.5 text-center text-xs font-semibold text-white uppercase tracking-wider border border-gray-400 whitespace-nowrap"
                        >
                          STT
                        </th>
                        <th
                          rowSpan="2"
                          className="px-1.5 py-1.5 text-center text-xs font-semibold text-white uppercase tracking-wider border border-gray-400 whitespace-nowrap"
                        >
                          Team
                        </th>
                        <th
                          rowSpan="2"
                          className="px-1.5 py-1.5 text-center text-xs font-semibold text-white uppercase tracking-wider border border-gray-400 whitespace-nowrap"
                        >
                          Marketing
                        </th>
                        {visibleColumns.cpqc && (
                          <th
                            rowSpan="2"
                            className="px-1.5 py-1.5 text-center text-xs font-semibold text-white uppercase tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            CPQC
                          </th>
                        )}
                        {visibleColumns.chot && (
                          <th
                            colSpan="2"
                            className="px-1.5 py-1.5 text-center text-xs font-semibold text-white uppercase tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Số đơn và DS chốt
                          </th>
                        )}
                        {visibleColumns.huy && (
                          <th
                            colSpan="2"
                            className="px-1.5 py-1.5 text-center text-xs font-semibold text-white tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Số đơn và DS hủy
                          </th>
                        )}
                        {visibleColumns.sauHuy && (
                          <th
                            colSpan="2"
                            className="px-1.5 py-1.5 text-center text-xs font-semibold text-white tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Số đơn và DS sau hủy
                          </th>
                        )}
                        {visibleColumns.di && (
                          <th
                            colSpan="2"
                            className="px-1.5 py-1.5 text-center text-xs font-semibold text-white tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Số đơn và DS đi
                          </th>
                        )}
                        {visibleColumns.thuTien && (
                          <th
                            colSpan="2"
                            className="px-1.5 py-1.5 bg-yellow-500 text-center text-xs font-semibold text-black tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Số đơn và DThu thành công
                          </th>
                        )}
                        {visibleColumns.ship && (
                          <th
                            rowSpan="2"
                            className="px-1.5 py-1.5 text-center text-xs font-semibold text-white tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Ship
                          </th>
                        )}
                        {visibleColumns.dThuKpi && (
                          <th
                            rowSpan="2"
                            className="px-1.5 py-1.5 bg-yellow-500 text-black text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            DThu tính KPI
                          </th>
                        )}
                        {visibleColumns.tyLeThuTien && (
                          <th
                            rowSpan="2"
                            className="px-1.5 py-1.5 bg-yellow-500 text-black text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Tỷ lệ thu tiền
                          </th>
                        )}
                        {visibleColumns.tyLeDatKpi && (
                          <th
                            rowSpan="2"
                            className="px-1.5 py-1.5 bg-yellow-500 text-black text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            Tỷ lệ đạt KPI
                          </th>
                        )}
                        {visibleColumns.cpds && (
                          <th
                            rowSpan="2"
                            className="px-1.5 py-1.5 bg-yellow-500 text-black text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap"
                          >
                            %CP/DS
                          </th>
                        )}
                      </tr>
                      <tr className="bg-secondary text-white">
                        {visibleColumns.chot && (
                          <>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              Số đơn
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              DS chốt
                            </th>
                          </>
                        )}
                        {visibleColumns.huy && (
                          <>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              Số đơn
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              DS hủy
                            </th>
                          </>
                        )}
                        {visibleColumns.sauHuy && (
                          <>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              Số đơn
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              DS sau hủy
                            </th>
                          </>
                        )}
                        {visibleColumns.di && (
                          <>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              Số đơn
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              DS đi
                            </th>
                          </>
                        )}
                        {visibleColumns.thuTien && (
                          <>
                            <th className="px-1.5 py-1.5 bg-yellow-500 text-black text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              Số đơn
                            </th>
                            <th className="px-1.5 py-1.5 bg-yellow-500 text-black text-center text-xs font-semibold tracking-wider border border-gray-400 whitespace-nowrap">
                              DThu TC
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Total row */}
                      <tr className="bg-green-700 font-semibold border-b-4 border-yellow-500">
                        <td
                          colSpan="3"
                          className="px-1.5 py-2 text-left pl-5 text-xs font-bold text-white border border-gray-300"
                        >
                          TỔNG CỘNG
                        </td>
                        {visibleColumns.cpqc && (
                          <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                            {totals.cpqc.toLocaleString("vi-VN")} đ
                          </td>
                        )}
                        {visibleColumns.chot && (
                          <>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-center text-white border border-gray-300">
                              {totals.soDonChot.toLocaleString("vi-VN")}
                            </td>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                              {totals.dsChot.toLocaleString("vi-VN")} đ
                            </td>
                          </>
                        )}
                        {visibleColumns.huy && (
                          <>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-center text-white border border-gray-300">
                              {totals.soDonHuy.toLocaleString("vi-VN")}
                            </td>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                              {totals.dsHuy.toLocaleString("vi-VN")} đ
                            </td>
                          </>
                        )}
                        {visibleColumns.sauHuy && (
                          <>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-center text-white border border-gray-300">
                              {totals.soDonSauHuy.toLocaleString("vi-VN")}
                            </td>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                              {totals.dsSauHuy.toLocaleString("vi-VN")} đ
                            </td>
                          </>
                        )}
                        {visibleColumns.di && (
                          <>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-center text-white border border-gray-300">
                              {totals.soDonDi.toLocaleString("vi-VN")}
                            </td>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                              {totals.dsDi.toLocaleString("vi-VN")} đ
                            </td>
                          </>
                        )}
                        {visibleColumns.thuTien && (
                          <>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-center text-white border border-gray-300">
                              {totals.soDonThuTien.toLocaleString("vi-VN")}
                            </td>
                            <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                              {totals.dThuThanhCong.toLocaleString("vi-VN")} đ
                            </td>
                          </>
                        )}
                        {visibleColumns.ship && (
                          <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                            {totals.ship.toLocaleString("vi-VN")} đ
                          </td>
                        )}
                        {visibleColumns.dThuKpi && (
                          <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                            {totals.dThuTinhKpi.toLocaleString("vi-VN")} đ
                          </td>
                        )}
                        {visibleColumns.tyLeThuTien && (
                          <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                            {((totals.tyLeThuTien || 0) * 100).toFixed(2)}%
                          </td>
                        )}
                        {visibleColumns.tyLeDatKpi && (
                          <td className="px-1.5 py-2 whitespace-nowrap text-xs font-medium border border-gray-300 text-center">
                            -
                          </td>
                        )}
                        {visibleColumns.cpds && (
                          <td className="px-1.5 py-2 whitespace-nowrap text-xs font-bold text-right text-white border border-gray-300">
                            {((totals.cpds || 0) * 100).toFixed(2)}%
                          </td>
                        )}
                      </tr>
                      {kpiData.map((item, index) => {
                        const tyLeThuTien =
                          item.dsDi > 0 ? item.dThuThanhCong / item.dsDi : 0;
                        const cpds =
                          item.dsSauHuy > 0 ? item.cpqc / item.dsSauHuy : 0;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-gray-300">
                              {index + 1}
                            </td>
                            <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-gray-300">
                              {item.team}
                            </td>
                            <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-gray-900 border border-gray-300">
                              {item.name}
                            </td>
                            {visibleColumns.cpqc && (
                              <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                {item.cpqc?.toLocaleString("vi-VN")}đ
                              </td>
                            )}
                            {visibleColumns.chot && (
                              <>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-center text-gray-900 border border-gray-300">
                                  {item.soDonChot?.toLocaleString("vi-VN")}
                                </td>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                  {item.dsChot?.toLocaleString("vi-VN")}đ
                                </td>
                              </>
                            )}
                            {visibleColumns.huy && (
                              <>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-center text-gray-900 border border-gray-300">
                                  {item.soDonHuy?.toLocaleString("vi-VN")}
                                </td>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                  {item.dsHuy?.toLocaleString("vi-VN")}đ
                                </td>
                              </>
                            )}
                            {visibleColumns.sauHuy && (
                              <>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-center text-gray-900 border border-gray-300">
                                  {item.soDonSauHuy?.toLocaleString("vi-VN")}
                                </td>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                  {item.dsSauHuy?.toLocaleString("vi-VN")}đ
                                </td>
                              </>
                            )}
                            {visibleColumns.di && (
                              <>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-center text-gray-900 border border-gray-300">
                                  {item.soDonDi?.toLocaleString("vi-VN")}
                                </td>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                  {item.dsDi?.toLocaleString("vi-VN")}đ
                                </td>
                              </>
                            )}
                            {visibleColumns.thuTien && (
                              <>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-center text-gray-900 border border-gray-300">
                                  {item.soDonThuTien?.toLocaleString("vi-VN")}
                                </td>
                                <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                  {item.dThuThanhCong?.toLocaleString("vi-VN")}đ
                                </td>
                              </>
                            )}
                            {visibleColumns.ship && (
                              <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                {item.ship?.toLocaleString("vi-VN")}đ
                              </td>
                            )}
                            {visibleColumns.dThuKpi && (
                              <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                {item.dThuTinhKpi?.toLocaleString("vi-VN")}đ
                              </td>
                            )}
                            {visibleColumns.tyLeThuTien && (
                              <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300">
                                {((tyLeThuTien || 0) * 100).toFixed(2)}%
                              </td>
                            )}
                            {visibleColumns.tyLeDatKpi && (
                              <td className="px-1.5 py-1.5 whitespace-nowrap text-xs font-medium border border-gray-300 text-center">
                                -
                              </td>
                            )}
                            {visibleColumns.cpds && (
                              <td
                                className={`px-1.5 py-1.5 whitespace-nowrap text-xs font-medium text-right text-gray-900 border border-gray-300 ${
                                  cpds > 0.33 ? "bg-yellow-200" : ""
                                }`}
                              >
                                {((cpds || 0) * 100).toFixed(2)}%
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
