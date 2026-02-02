import { useEffect, useState } from 'react';
import { useAppState } from '../../context/Context';
import { ChevronDown } from 'lucide-react';
import apiClient from '../../services/apiClient';

const Filters = ({ isOpen, onToggle }) => {
  const { activeFilters, setActiveFilters } = useAppState();
  const [expandedCategories, setExpandedCategories] = useState({
    creative_fields: true,
    availability: true,
    location: true,
    tools: true,
    color: true
  });

  // Default data for filters matching Behance categories
  const [filterOptions, setFilterOptions] = useState({
    creative_fields: ['Graphic Design', 'Illustration', 'Photography', 'UI/UX', 'Web Design', 'Animation', 'Branding'],
    availability: ['Available Now', 'Available Soon', 'Not Available'],
    location: ['USA', 'Canada', 'UK', 'Germany', 'France', 'India', 'Japan', 'China', 'Brazil', 'Australia'],
    tools: ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'XD', 'CorelDRAW', 'Blender'],
    color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White', 'Gray', 'Pink']
  });

  useEffect(() => {
    let isMounted = true;
    const loadFilters = async () => {
      const result = await apiClient.getFilterValues();
      if (isMounted && result.success && result.data?.data) {
        const incoming = result.data.data;
        setFilterOptions(prev => ({
          creative_fields: incoming.creative_fields?.length ? incoming.creative_fields : prev.creative_fields,
          availability: incoming.availability?.length ? incoming.availability : prev.availability,
          location: incoming.location?.length ? incoming.location : prev.location,
          tools: incoming.tools?.length ? incoming.tools : prev.tools,
          color: incoming.color?.length ? incoming.color : prev.color,
        }));
      }
    };
    loadFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFilter = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isFilterActive = (filterType, value) => {
    return activeFilters[filterType].includes(value);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      creative_fields: [],
      availability: [],
      location: [],
      tools: [],
      color: []
    });
  };

  const removeFilter = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
  };

  const appliedFilters = Object.entries(activeFilters)
    .flatMap(([type, values]) => values.map(value => ({ type, value })));

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200">
      <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base">Filters</h2>
          {appliedFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-gray-600 hover:text-black"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {appliedFilters.length > 0 && (
        <div className="px-5 pt-4">
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map(({ type, value }) => (
              <button
                key={`${type}-${value}`}
                onClick={() => removeFilter(type, value)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                title="Remove"
              >
                {value} ×
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 space-y-0">
          {/* Creative Fields Filter */}
          <div className="border-b border-gray-200 py-4">
            <button
              onClick={() => toggleCategory('creative_fields')}
              className="w-full text-left flex justify-between items-center hover:text-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900">Creative Fields</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.creative_fields ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expandedCategories.creative_fields ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2">
                {filterOptions.creative_fields.map(field => (
                  <label key={field} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isFilterActive('creative_fields', field)}
                      onChange={() => toggleFilter('creative_fields', field)}
                      className="w-4 h-4 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="border-b border-gray-200 py-4">
            <button
              onClick={() => toggleCategory('availability')}
              className="w-full text-left flex justify-between items-center hover:text-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900">Availability</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.availability ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expandedCategories.availability ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2">
                {filterOptions.availability.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isFilterActive('availability', item)}
                      onChange={() => toggleFilter('availability', item)}
                      className="w-4 h-4 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="border-b border-gray-200 py-4">
            <button
              onClick={() => toggleCategory('location')}
              className="w-full text-left flex justify-between items-center hover:text-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900">Location</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.location ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expandedCategories.location ? 'max-h-56 opacity-100 mt-3 overflow-y-auto' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2">
                {filterOptions.location.map(location => (
                  <label key={location} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isFilterActive('location', location)}
                      onChange={() => toggleFilter('location', location)}
                      className="w-4 h-4 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Filter */}
          <div className="border-b border-gray-200 py-4">
            <button
              onClick={() => toggleCategory('tools')}
              className="w-full text-left flex justify-between items-center hover:text-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900">Tools</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.tools ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expandedCategories.tools ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2">
                {filterOptions.tools.map(tool => (
                  <label key={tool} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isFilterActive('tools', tool)}
                      onChange={() => toggleFilter('tools', tool)}
                      className="w-4 h-4 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Color Filter */}
          <div className="border-b border-gray-200 py-4">
            <button
              onClick={() => toggleCategory('color')}
              className="w-full text-left flex justify-between items-center hover:text-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900">Color</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.color ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                expandedCategories.color ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2">
                {filterOptions.color.map(col => (
                  <label key={col} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isFilterActive('color', col)}
                      onChange={() => toggleFilter('color', col)}
                      className="w-4 h-4 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{col}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Filters;
