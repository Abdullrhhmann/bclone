import {
  SlidersHorizontal,
  Search as SearchIcon,
  Image,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sort_by_search_bar } from "../../data/search";
import { searchSuggestions } from "../../data/search/suggestions";
import { useAppState } from "../../context/Context";

const Search = ({ filtersOpen, onToggleFilters }) => {
  const { setRecommendedStates, setSearchQuery } = useAppState();
  const [recommendedModalOpen, setRecommendedModalOpen] = useState(false);
  const [recommendedState, setRecommendedState] = useState(
    sort_by_search_bar[0].heading
  );
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchSuggestionModalOpen, setSearchSuggestionModalOpen] =
    useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(e.target) &&
        trigger.current &&
        !trigger.current.contains(e.target)
      ) {
        setRecommendedModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const trigger2 = useRef(null);
  const dropdown2 = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdown2.current &&
        !dropdown2.current.contains(e.target) &&
        trigger2.current &&
        !trigger2.current.contains(e.target)
      ) {
        setSearchSuggestionModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (localSearchQuery) {
      const filtered = searchSuggestions.filter((item) =>
        item.toLowerCase().includes(localSearchQuery.toLowerCase())
      );
      setSuggestions(filtered.map((item) => item));
    } else {
      setSuggestions(
        // add any random 7
        searchSuggestions.slice(0, 7).map((item) => item)
      );
    }
  }, [localSearchQuery]);

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
    setSearchSuggestionModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex sm:flex-row flex-col gap-4 items-center">
        <button 
          onClick={onToggleFilters}
          className="flex gap-2 hover:bg-gray-100 cursor-pointer duration-300 transform border p-3 justify-center items-center rounded-full sm:w-[8rem] w-full"
        >
          {filtersOpen ? (
            <ArrowLeft size={17} className="text-gray-500" />
          ) : (
            <SlidersHorizontal size={17} className="text-gray-500" />
          )}
          <h1 className="font-semibold">Filter</h1>
        </button>
        <div
          className={`flex ${
            searchSuggestionModalOpen
              ? "rounded-t-2xl border bg-white shadow-2xl"
              : "rounded-full bg-[#f9f9f9]"
          }  w-full items-center relative`}
        >
          <div
            className="flex items-center px-6 py-3 gap-4 w-full text-bold"
            ref={trigger2}
          >
            <SearchIcon size={20} className="" strokeWidth="2.52px" />
            <input
              type="text"
              placeholder="Search the creative world at work"
              className={`outline-none w-full placeholder:font-bold placeholder:text-black font-bold text-black text-[1.15rem] ${
                searchSuggestionModalOpen ? "bg-white" : "bg-[#f9f9f9]"
              }`}
              value={localSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchSuggestionModalOpen(true)}
            />
          </div>
          {!localSearchQuery && !searchSuggestionModalOpen && (
            <div className="sm:flex hidden gap-2 border bg-white w-[12rem] justify-center p-2 rounded-full mr-1 items-center">
              <Image size={20} className="text-gray-500" />
              <h1 className="font-semibold">Search by Image</h1>
            </div>
          )}
          {suggestions.length > 0 && searchSuggestionModalOpen && (
            <div
              className="absolute mb-6 top-full w-full bg-white shadow-lg rounded-b-2xl z-10"
              ref={dropdown2}
            >
              <h1 className="font-semibold indent-10 text-sm text-gray-600 uppercase px-4 py-2">
                Suggested Searches
              </h1>
              <ul className="mb-8 indent-10">
                {suggestions.slice(0, 6).map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-1 cursor-pointer text-black text-[1.15rem] font-bold hover:bg-gray-100 transform duration-300"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div
          className="sm:flex hidden hover:border-black cursor-pointer gap-2 border-2 transform duration-300 p-3 justify-center items-center rounded-full w-[15rem]"
          onClick={() => setRecommendedModalOpen(!recommendedModalOpen)}
          ref={trigger}
        >
          <h1 className="font-semibold">{recommendedState}</h1>
          <ChevronDown
            size={17}
            className={`${
              recommendedModalOpen
                ? "rotate-180 transform duration-300"
                : "transform duration-300"
            }`}
          />
        </div>
        {recommendedModalOpen && (
          <div
            className="absolute right-0 z-40 top-[8rem] bg-white shadow-lg py-4 rounded w-[13rem]"
            ref={dropdown}
          >
            <div className="flex flex-col ml-6 gap-2">
              {sort_by_search_bar.map((item, index) => (
                <h1
                  key={index}
                  className="font-semibold cursor-pointer hover:text-blue2"
                  onClick={() => {
                    setRecommendedState(item.heading);
                    setRecommendedStates(item.heading);
                  }}
                >
                  {item.heading}
                </h1>
              ))}
            </div>
          </div>
        )}
      </div>
      <hr className="w-full h-[1px] mt-4" />
    </div>
  );
};

export default Search;
