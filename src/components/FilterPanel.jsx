// src/components/filter-panel/FilterPanel.jsx
import React, { useState, useMemo, memo, useCallback } from "react";
import {Search, X, Filter, Trash2, Calendar, ChevronDown, Sliders, Package, Clock, MapPin, CreditCard, Users, Check } from "lucide-react";
import CollapsibleSection from "./FilterPanel/CollapsibleSection";
import Icon from "./FilterPanel/Icon";

// Component CheckboxGroup thay thế cho CheckboxFilter với dropdown
const CheckboxGroup = memo(({ 
  title, 
  items = [], 
  selected = [], 
  onToggle, 
  visible = true,
  icon,
  maxHeight = "max-h-40"
}) => {
  if (!visible) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-3">
        <Icon>{icon}</Icon>
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      </div>
      <div className={`overflow-y-auto ${maxHeight} space-y-1`}>
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center px-3 py-2 hover:bg-green-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-green-200"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="w-4 h-4 rounded text-green-600 focus:ring-2 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700 flex-1">{item}</span>
          </label>
        ))}
        {items.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-2">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
});

// Component chính FilterPanel
function FilterPanel({
  activeTab,
  filters,
  handleFilterChange,
  quickSelectValue,
  handleQuickDateSelect,
  availableFilters,
  userRole,
  hasActiveFilters,
  clearAllFilters,
  showMarkets = true,
  showPaymentMethodSearch = false,
}) {
  const [searchTerms, setSearchTerms] = useState({});

  // Hàm xử lý toggle filter
  const handleToggle = useCallback(
    (key, value) => {
      handleFilterChange(key, value);
    },
    [handleFilterChange]
  );

  // Hàm tìm kiếm trong các filter
  const handleFilterSearch = useCallback((filterKey, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterKey]: value.toLowerCase()
    }));
  }, []);

  // Lọc items dựa trên search term
  const getFilteredItems = useCallback((items = [], filterKey) => {
    const searchTerm = searchTerms[filterKey];
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm)
    );
  }, [searchTerms]);

  // Component SearchInput cho các filter
  const SearchInput = memo(({ filterKey, placeholder }) => (
    <div className="relative mb-2">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerms[filterKey] || ""}
        onChange={(e) => handleFilterSearch(filterKey, e.target.value)}
        className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
      />
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      {searchTerms[filterKey] && (
        <button
          onClick={() => handleFilterSearch(filterKey, "")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  ));

  // Component FilterGroup kết hợp CheckboxGroup và SearchInput
  const FilterGroup = memo(({ config, filters, availableFilters, activeTab, userRole }) => {
    const { key, title, icon: IconComponent, visible = true, showBorder = true, keyFilter } = config;
    if (!visible) return null;

    const filterKey = keyFilter || key;
    const items = getFilteredItems(availableFilters[key] || [], filterKey);
    const selected = filters[filterKey] || [];

    return (
      <div className={showBorder ? "mb-6 pb-4 border-b border-gray-100" : "mb-2"}>
        <CheckboxGroup
          title={title}
          items={items}
          selected={selected}
          onToggle={(v) => handleToggle(filterKey, v)}
          icon={<IconComponent className="w-4 h-4" />}
        />
        <SearchInput filterKey={filterKey} placeholder={`Tìm ${title.toLowerCase()}...`} />
      </div>
    );
  });

  // Cấu hình các filter groups
  const filterConfigs = [
    { key: 'products', title: 'Sản phẩm', icon: Package, visible: activeTab !== "users" },
    { key: 'shifts', title: 'Ca làm việc', icon: Clock },
    { key: 'markets', title: 'Thị trường', icon: MapPin, visible: showMarkets && activeTab !== "users" },
    { key: 'paymentMethods', title: 'Thanh toán', icon: CreditCard, visible: showPaymentMethodSearch, keyFilter: 'paymentMethod' },
    { key: 'teams', title: 'Team', icon: Users, visible: userRole === "admin" || activeTab === "detailed", showBorder: false },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Bộ lọc
            </h3>
          </div>
          {hasActiveFilters?.() && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Ngày tháng - Giữ nguyên dropdown */}
        {activeTab !== "users" && (
          <CollapsibleSection
            id="date"
            title="Ngày tháng"
            icon={<Calendar className="w-5 h-5" />}
          >
            <div className="relative">
              <select
                onChange={handleQuickDateSelect}
                value={quickSelectValue || ""}
                className="appearance-none w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white text-sm shadow-sm hover:border-blue-300 transition-all cursor-pointer"
              >
                <option value="">-- Chọn nhanh --</option>
                <optgroup label="Ngày">
                  <option value="today">Hôm nay</option>
                  <option value="yesterday">Hôm qua</option>
                </optgroup>
                <optgroup label="Tuần">
                  <option value="this-week">Tuần này</option>
                  <option value="last-week">Tuần trước</option>
                  <option value="next-week">Tuần sau</option>
                </optgroup>
                <optgroup label="Tháng">
                  <option value="this-month">Tháng này</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`month-${i + 1}`}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Quý">
                  {[1, 2, 3, 4].map((q) => (
                    <option key={q} value={`q${q}`}>Quý {q}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Từ</label>
                <input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Đến</label>
                <input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Bộ lọc chi tiết - Không dùng dropdown */}
        <CollapsibleSection
          id="filters"
          title="Bộ lọc chi tiết"
          icon={<Sliders className="w-5 h-5" />}
        >
          {filterConfigs.map((config) => (
            <FilterGroup
              key={config.key}
              config={config}
              filters={filters}
              availableFilters={availableFilters}
              activeTab={activeTab}
              userRole={userRole}
            />
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
}

export default FilterPanel;