/* eslint-disable react/prop-types */
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import proLogo from "../../assets/logos/pro.png";
import beLogo from "../../assets/logos/blue-logo-be.png";

import { notificationsData } from "../../data/navbar/Navbar2";
const NotificationItem = ({
  heading,
  description,
  subheading,
  subdescription,
  posted,
}) => (
  <div className="flex p-2 tracking-tight leading-5 cursor-pointer hover:bg-blue-50 transform duration-300 rounded-md">
    <div className="flex">
      <div className="flex w-[5rem] h-[5rem]">
        <img
          src={beLogo}
          alt="behance-blue-logo"
          className="object-cover rounded-full p-3"
        />
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex">
        <h1 className="font-semibold">{heading}</h1>
      </div>
      <div className="flex">
        <h1 className="">{description}</h1>
      </div>
      <div className="flex items-center mt-2 gap-3 text-sm border p-4 rounded-xl">
        <div className="flex">
          <img src={proLogo} alt="pro-logo" className="w-[6rem] h-[5rem] rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold">{subheading}</h1>
          <button className="text-blue-500 border w-fit px-3 py-1 font-bold bg-blue-50 rounded-2xl">{subdescription}</button>
        </div>
      </div>
      <div className="flex mt-[-6px]">
        <h1 className="text-gray-500 text-sm">{posted}</h1>
      </div>
    </div>
  </div>
);

const Notifications = () => {
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
        <Bell size={20} fill="#000" />
      </button>
      {openModal && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={dropdown}
          id="dropdownNotification"
          className="z-20 flex flex-col absolute md:right-[16rem] right-0  w-full max-w-[26rem] bg-white divide-y divide-gray-100 rounded-md shadow-xl shadow-gray-500 border"
          aria-labelledby="dropdownNotificationButton "
        >
          <div className="block px-4 py-3 text-center rounded-t-lg font-bold text-[1.1rem]">
            Your Notifications
          </div>
          <div className="overflow-y-auto max-h-[30rem] z-10 backdrop-filter backdrop-blur-lg rounded-bl-md">
            {notificationsData.map((item, index) => (
              <NotificationItem key={index} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
