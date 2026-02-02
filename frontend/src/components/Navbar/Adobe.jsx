import React, { useRef, useState } from 'react'
import adobe_logo from '../../assets/images/adobe.png'
import { ArrowRight, MoveRight } from 'lucide-react';
import adobe_express from "../../assets/logos/adobe_express.png";
import adobe_red from "../../assets/logos/adobe_red.png";
import be_2letter from "../../assets/logos/be_2letter.png";
const Adobe = () => {
  const [openModal, setOpenModal] = useState(false);
  const [responseData, setResponse] = useState({});
  const dropdown = useRef(null);
  const trigger = useRef(null);

  const handleMouseEnter = () => {
    setOpenModal(true);
  };

  const handleMouseLeave = () => {
    setOpenModal(false);
  };

  return (
    <div className="">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={trigger}
        id="dropdownNotificationButton"
        data-dropdown-toggle="dropdownNotification"
        className="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 p-3 rounded-md gap-2 focus:outline-none border-2 border-white hover:border-light-secondary"
        type="button"
      >
        <img src={adobe_logo} alt="adobe-logo" width={20} height={20} />
        <h1 className="font-bold cursor-pointer">Adobe</h1>
      </button>
      {openModal && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={dropdown}
          id="dropdownNotification"
          className="z-20 flex flex-col absolute right-0  w-[33rem] bg-white divide-y divide-gray-100 rounded-md shadow-xl shadow-gray-500 border"
          aria-labelledby="dropdownNotificationButton "
        >
          <div className="overflow-y-auto max-h-[30rem] z-10 backdrop-filter backdrop-blur-lg rounded-bl-md flex flex-col gap-2 p-6">
            <div className="flex gap-4 p-3 hover:bg-blue-200 cursor-pointer transform duration-300 bg-blue-50 border rounded-md justify-between">
              <div className="flex gap-4 items-center">
                <div className="flex w-[3.5rem] p-1">
                  <img src={adobe_red} alt="adobe-logo" />
                </div>
                <hr className="sm:flex hidden w-[1px] h-[30px] bg-gray-300" />
                <div className="flex flex-col">
                  <h1 className="font-bold text-blue2">Go to adobe.com</h1>
                  <p className="text-sm text-blue2 mt-[-px]">
                    Access your apps, services, files,and more
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <MoveRight size={20} className="text-blue2" />
              </div>
            </div>
            <div className="flex gap-4 p-3 hover:bg-blue-200 cursor-pointer transform duration-300 bg-blue-50 border rounded-md justify-between">
              <div className="flex gap-4 items-center">
                <div className="flex w-[3.5rem] p-1">
                  <img src={adobe_express} alt="adobe-logo" />
                </div>
                <hr className="sm:flex hidden w-[1px] h-[30px] bg-gray-300" />
                <div className="flex flex-col">
                  <h1 className="font-bold text-blue2">Get Adobe Express free</h1>
                  <p className="text-sm text-blue2 mt-[-px]">
                    Quickly make content from thousands of free templates

                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <MoveRight size={20} className="text-blue2" />
              </div>
            </div>
            <div className="flex gap-4 p-3 hover:bg-blue-200 cursor-pointer transform duration-300 bg-blue-50 border rounded-md justify-between">
              <div className="flex gap-4 items-center">
                <div className="flex w-[3.5rem] p-1">
                  <img src={be_2letter} alt="adobe-logo" />
                </div>
                <hr className="sm:flex hidden w-[1px] h-[30px] bg-gray-300" />
                <div className="flex flex-col">
                  <h1 className="font-bold text-blue2">7 day free trial of Behance Pro</h1>
                  <p className="text-sm text-blue2 mt-[-px]">
                    Supercharge your creative career with Behance Pro

                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <MoveRight size={20} className="text-blue2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adobe;
