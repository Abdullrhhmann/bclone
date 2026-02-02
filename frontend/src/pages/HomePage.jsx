import React, { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Search from '../components/SearchBar/Search'
import Content from '../components/Content/Content'
import Filters from '../components/Filters/Filters'
import Footer from '../components/Footer/Footer'
import Copyright from '../components/Footer/Copyright'
import FooterSection from '../components/Footer'
import PopupSign from '../components/Footer/PopupSign'
import PopupLogin from '../components/Footer/PopupLogin'

const HomePage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 py-2 flex flex-col gap-4">
        <Navbar />
        <Search filtersOpen={filtersOpen} onToggleFilters={() => setFiltersOpen(!filtersOpen)} />
      </div>

      <div className="flex w-full px-6">
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            filtersOpen ? 'w-64 mr-6' : 'w-0 mr-0'
          }`}
        >
          <Filters isOpen={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)} />
        </div>
        <div className="flex-1 min-w-0 transition-all duration-300 ease-out">
          <Content />
        </div>
      </div>

      <FooterSection />
      <PopupSign />
      <PopupLogin />
    </div>
  );
}

export default HomePage