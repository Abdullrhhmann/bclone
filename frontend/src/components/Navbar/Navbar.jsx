import React, { useState } from "react";
import behance_logo from "../../assets/images/Behance-Logo.png";
import adobe_logo from "../../assets/images/adobe.png";
import { Navbar1 } from "../../data/navbar/Navbar1";
import { ChevronDown, Clipboard, Info, Menu, PlusCircle, Search, Plus, User } from "lucide-react";
import { Navbar2 } from './../../data/navbar/Navbar2';
import Notifications from "./Notification";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Adobe from "./Adobe";
import { useAppState } from "../../context/Context";

const Navbar = () => {
  const [exploreHover, setExploreHover] = useState(false);
  const [hireFreelancersHover, setHireFreelancersHover] = useState(false);
  const { isAuthenticated, user, setCurrentPage } = useAppState();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="sm:hidden flex gap-4">
          <Menu size={20} />
        </div>
        <div className="flex w-[30%] items-center gap-5 sm:ml-0 ml-[-4rem]">
          <div className="flex mt-[-2px]">
            <img src={behance_logo} alt="behance-logo" width={80} height={80} />
          </div>
          <div className="lg:flex hidden justify-between items-center gap-5">
            {Object.keys(Navbar1).map((item, index) => (
              <div key={index} className="flex flex-col gap-2 relative z-20">
                <div
                  className="flex gap-1 items-center"
                  onMouseEnter={() =>
                    Navbar1[item].dropdownItems && setExploreHover(true)
                  }
                  onMouseLeave={() =>
                    Navbar1[item].dropdownItems && setExploreHover(false)
                  }
                >
                  <h1 className="cursor-pointer font-bold">
                    {Navbar1[item].heading}
                  </h1>
                  {Navbar1[item].dropdownItems && (
                    <ChevronDown size={17} className="cursor-pointer" />
                  )}
                </div>
                {Navbar1[item].dropdownItems && exploreHover && (
                  <ul
                    className="absolute top-full left-0 py-4 bg-white shadow-xl rounded w-[13.5rem]"
                    onMouseEnter={() => setExploreHover(true)}
                    onMouseLeave={() => setExploreHover(false)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col ml-6 gap-1 text-[0.95rem]">
                        <h1 className="font-bold text-blue1">
                          Search & Explore
                        </h1>
                        <h1 className="font-semibold cursor-pointer hover:text-blue1">
                          Curated Galleries
                        </h1>
                      </div>
                      <hr className="my-2" />
                      {Navbar1[item].dropdownItems.map(
                        (dropdownItem, index) => (
                          <li
                            key={index}
                            className="ml-6 text-sm text-gray-500 hover:text-blue1"
                          >
                            <a href={dropdownItem.route}>{dropdownItem.name}</a>
                          </li>
                        )
                      )}
                    </div>
                  </ul>
                )}
              </div>
            ))}
            <div className="flex text-[0.6rem] font-semibold tracking-widest ml-[-8px] bg-blue-600 text-white px-2 py-1 rounded-md">
              PRO
            </div>
          </div>
        </div>
        <hr className="sm:flex hidden w-[1px] h-[30px] bg-gray-300" />
        <div className="sm:flex hidden w-[70%] justify-between items-center">
          <div className="flex">
            {Object.keys(Navbar2).map((item, index) => (
              <div key={index} className="flex flex-col gap-2 relative">
                <div
                  className="flex gap-1 items-center"
                  onMouseEnter={() =>
                    Navbar2[item].dropdown && setHireFreelancersHover(true)
                  }
                  onMouseLeave={() =>
                    Navbar2[item].dropdown && setHireFreelancersHover(false)
                  }
                >
                  <h1 className="cursor-pointer font-bold">
                    {Navbar2[item].heading}
                  </h1>
                  {Navbar2[item].dropdown && (
                    <ChevronDown size={17} className="cursor-pointer" />
                  )}
                </div>
                {Navbar2[item].dropdown && hireFreelancersHover && (
                  <ul
                    className="absolute top-full left-0 bg-white shadow-md py-4 rounded w-[15rem] z-20"
                    onMouseEnter={() => setHireFreelancersHover(true)}
                    onMouseLeave={() => setHireFreelancersHover(false)}
                  >
                    <div className="flex flex-col ml-6 gap-2">
                      <div className="flex gap-2 items-center">
                        <Info size={15} />
                        <h1 className="font-semibold hover:text-blue1 cursor-pointer">
                          Hiring in Behance
                        </h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Search size={15} />
                        <h1 className="font-semibold hover:text-blue1 cursor-pointer">
                          Find Creatives
                        </h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Clipboard size={15} />
                        <h1 className="font-semibold hover:text-blue1 cursor-pointer">
                          Hiring in Behance
                        </h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <PlusCircle size={15} />
                        <h1 className="font-semibold hover:text-blue1 cursor-pointer">
                          New Freelance Projects
                        </h1>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="flex flex-col ml-6 gap-2">
                      {Navbar2[item].dropdown2.map((dropdownItem, index) => (
                        <h1
                          key={index}
                          className="text-sm text-gray-500 cursor-pointer hover:text-blue1"
                        >
                          {dropdownItem.heading}
                        </h1>
                      ))}
                    </div>
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <Notifications />
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setCurrentPage('createProject')}
                  className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-3xl font-semibold transition duration-300"
                >
                  <Plus size={18} />
                  Upload
                </button>
                <button
                  onClick={() => setCurrentPage('myProfile')}
                  className="flex gap-2 items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-3xl font-semibold transition duration-300"
                >
                  <User size={18} />
                  {user?.firstName || 'Profile'}
                </button>
              </>
            )}
            <LogIn />
            <SignUp />
            {/* <div className="flex">
              <button className="flex gap-1 items-center">
                <img src={adobe_logo} alt="adobe-logo" width={20} height={20} />
                <h1 className="font-bold cursor-pointer">Adobe</h1>
              </button>
            </div> */}
            <Adobe />
          </div>
        </div>
        <div className="sm:hidden flex items-center gap-4 ">
          <div className="flex gap-4">
            <Notifications />
          </div>
          <div className="flex gap-4 ">
            <Search size={20} strokeWidth="2.5px" />
          </div>
        </div>
      </div>
      <hr className="sm:flex hidden w-full h-[1px] bg-gray-800" />
    </div>
  );
};

export default Navbar;
