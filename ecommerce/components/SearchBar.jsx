import { useState } from 'react';
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const SearchBar = ({ onSearch, placeholder = "Search for products..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="w-full ">
      <div
        className={`relative flex items-center bg-white rounded-lg shadow-sm transition-all duration-200 ${isFocused ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
          }`}
      >
        <div className="absolute left-3 sm:left-4 text-gray-400">
          <Search size={18} className="sm:w-5 sm:h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-transparent outline-none rounded-lg"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const FilterSection = ({ filters, onFilterChange, onClearFilters, categories }) => {
  console.log("filters", filters)
  // console.log("on filters change", onFilterChange)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: false,
    availability: false
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSection = (section) => {
    console.log("sections", section)
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2500', min: 1000, max: 2500 },
    { label: '₹2500 - ₹5000', min: 2500, max: 5000 },
    { label: 'Above ₹5000', min: 5000, max: Infinity }
  ];

  const handleCategoryChange = (category) => {
    // console.log("changing category noww",category)
    // console.log("filterss",filters)
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (range) => {
    console.log("price,range", range)
    onFilterChange({ ...filters, priceRange: range });
  };

  const handleRatingChange = (rating) => {
    console.log("min rating", rating)
    onFilterChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleAvailabilityChange = (inStock) => {
    onFilterChange({ ...filters, inStock: filters.inStock === inStock ? null : inStock });
  };

  const activeFiltersCount =
    filters.categories.length +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStock !== null ? 1 : 0);

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="sm:w-5 sm:h-5 text-gray-700" />
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="border-t pt-3 sm:pt-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full mb-2 sm:mb-3"
        >
          <span className="text-sm sm:text-base font-medium text-gray-900">Category</span>
          {expandedSections.category ? <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
        {expandedSections.category && (
          <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label key={category.category_id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.category_name)}
                  onChange={() => handleCategoryChange(category.category_name)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                  {category.category_name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-2 sm:mb-3"
        >
          <span className="text-sm sm:text-base font-medium text-gray-900">Price Range</span>
          {expandedSections.price ? <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-1.5 sm:space-y-2">
            {priceRanges.map((range, index) => {
              {
                // console.log("the range",range)
              }
              return (

                <label key={index} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                    onChange={() => handlePriceChange(range)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900">
                    {range.label}
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      {/* <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full mb-2 sm:mb-3"
        >
          <span className="text-sm sm:text-base font-medium text-gray-900">Customer Rating</span>
          {expandedSections.rating ? <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-1.5 sm:space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                  {rating}★ & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div> */}

      {/* Availability Filter */}
      {/* <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-2 sm:mb-3"
        >
          <span className="text-sm sm:text-base font-medium text-gray-900">Availability</span>
          {expandedSections.availability ? <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
        {expandedSections.availability && (
          <div className="space-y-1.5 sm:space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock === true}
                onChange={() => handleAvailabilityChange(true)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900">
                In Stock
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock === false}
                onChange={() => handleAvailabilityChange(false)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900">
                Out of Stock
              </span>
            </label>
          </div>
        )}
      </div> */}
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Filter size={20} />
        {activeFiltersCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm p-4 sticky top-4">
        <FilterContent />
      </div>
    </>
  );
};