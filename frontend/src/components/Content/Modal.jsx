import { MessageCircle, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useAppState } from "../../context/Context";
import apiClient from "../../services/apiClient";

const Modal = () => {
  const { openModal, setOpenModal, setCurrentPage, setSelectedCreator, user, isAuthenticated, setLoginActive } = useAppState(false);
  const item = JSON.parse(localStorage.getItem("item"));
  const [isLiked, setIsLiked] = useState(() => {
    if (!item || !user?._id) return false;
    return Array.isArray(item.appreciations)
      ? item.appreciations.some((id) => id === user._id || id?._id === user._id)
      : false;
  });
  const [liking, setLiking] = useState(false);

  const imageUrls = useMemo(() => {
    if (!item) return [];
    const moduleImages = Array.isArray(item.modules)
      ? item.modules
          .filter((m) => m.type === 'image' && m.image?.url)
          .map((m) => m.image.url)
      : [];
    const cover = item.coverImage?.url ? [item.coverImage.url] : [];
    return [...cover, ...moduleImages];
  }, [item]);
  const navigateToCreatorProfile = () => {
    if (!item?.owner?.username && !item?.owner?.displayName) return;
    setSelectedCreator(item?.owner?.username || item?.owner?.displayName);
    setCurrentPage('profile');
    setOpenModal(false);
  };

  const handleLike = async () => {
    if (!item?._id) return;
    if (!isAuthenticated) {
      setLoginActive(true);
      return;
    }

    setLiking(true);
    try {
      if (isLiked) {
        const result = await apiClient.removeAppreciation(item._id);
        if (result.success) {
          setIsLiked(false);
        }
      } else {
        const result = await apiClient.appreciateProject(item._id);
        if (result.success) {
          setIsLiked(true);
        }
      }
    } finally {
      setLiking(false);
    }
  };
  return (
    <div className="fixed flex justify-center z-30 inset-0  backdrop-blur-sm brightness">
      <div className="flex flex-col gap-8 w-[90%] p-6 overflow-y-auto componentScroll">
        <div className="flex justify-between w-full h-fit">
          <div className="flex gap-3">
            <div className="flex w-12 h-12">
              <img
                src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg"
                alt=""
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col text-white ">
              <div className="flex font-bold">{item.title}</div>
              <div className="flex font-semibold gap-2">
                <button
                  type="button"
                  className="hover:underline"
                  onClick={navigateToCreatorProfile}
                >
                  {item?.owner?.displayName || item?.owner?.username}
                </button>
                <h1>•</h1>
                <h1>Follow</h1>
              </div>
            </div>
          </div>
          <div
            className="flex w-10 h-10 items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 duration-300 transform cursor-pointer"
            onClick={() => setOpenModal(false)}
          >
            <X size={20} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {imageUrls.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="random"
              className="rounded-md w-full h-full object-cover"
              width={400}
              height={400}
            />
          ))}
          <div className="absolute right-5 z-30 shadow-lg py-4 rounded h-[35rem]">
            <div className="flex flex-col gap-4 justify-center">
              <div className="flex flex-col gap-1 ">
                <div className="flex bg-white w-12 h-12 cursor-pointer rounded-full ">
                  <img
                    src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg"
                    alt=""
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex justify-center">
                  <h1 className="text-sm text-white sm:text-gray-400 font-semibold">
                    Share
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex bg-white w-12 h-12 cursor-pointer p-4 rounded-full ">
                  <svg
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                    className="IconMessageButton-icon-NkP"
                  >
                    <path d="M9,10.094l9-6.7615v-.75A.5735.5735,0,0,0,17.4375,2H.5625A.57351.57351,0,0,0,0,2.5835V3.318Z"></path>
                    <polygon points="12.389 8.981 18 13.184 18 6.667 18 4.771"></polygon>
                    <path d="M11.433,9.7,9.645,11.047a1.086,1.086,0,0,1-1.29,0L6.541,9.6875,0,14.534v.883A.573.573,0,0,0,.5625,16h16.875A.573.573,0,0,0,18,15.417v-.795Z"></path>
                    <polygon points="5.582 8.969 0 4.756 0 6.667 0 13.097"></polygon>
                  </svg>
                </div>
                <div className="flex">
                  <h1 className="text-sm text-white sm:text-gray-400 font-semibold">
                    Message
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-1 ">
                <div className="flex bg-white w-12 h-12 cursor-pointer p-4 rounded-full ">
                  <svg
                    className="Collection-icon-mXx Project-icon-qll"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                  >
                    <path
                      d="M5.69,3.395,7.97,5.487h6.217V7.579H2.858V3.743a.351.351,0,0,1,.354-.349ZM5.69,2H3.212a1.757,1.757,0,0,0-1.77,1.743V7.579h-1a.356.356,0,0,0-.27.123A.345.345,0,0,0,.1,7.985L1.336,14.68a.705.705,0,0,0,.7.572H15.012a.705.705,0,0,0,.7-.572L16.95,7.985a.345.345,0,0,0-.079-.283.356.356,0,0,0-.27-.123h-1V4.789a.7.7,0,0,0-.708-.7H8.523L6.859,2.514A1.657,1.657,0,0,0,5.69,2Z"
                      transform="translate(-0.023 -0.5)"
                    ></path>
                  </svg>
                </div>
                <div className="flex justify-center">
                  <h1 className="text-sm text-white sm:text-gray-400 font-semibold">
                    Save
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-1 ">
                <div className="flex bg-white w-12 h-12 cursor-pointer p-4 rounded-full ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-4334 -10720 14 13.363"
                    className="Project-icon-qll"
                  >
                    <g transform="translate(-2057 -6445)">
                      <path
                        d="M14.682 6h-2.068a.159.159 0 0 0-.159.159v.955a.159.159 0 0 0 .159.159h1.114v7H2.273v-7h1.113a.159.159 0 0 0 .159-.159v-.955A.159.159 0 0 0 3.386 6H1.318A.318.318 0 0 0 1 6.318v8.909a.318.318 0 0 0 .318.318h13.364a.318.318 0 0 0 .318-.318V6.318A.318.318 0 0 0 14.682 6z"
                        transform="translate(-2278 -4277.182)"
                      ></path>
                      <path
                        d="M13.282 3.287L10.188 0 7.1 3.287a.318.318 0 0 0 .237.531h1.579v4.3a.159.159 0 0 0 .159.159H11.3a.159.159 0 0 0 .159-.159v-4.3h1.584a.318.318 0 0 0 .237-.531z"
                        transform="translate(-2280.188 -4275)"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="flex justify-center">
                  <h1 className="text-sm text-white sm:text-gray-400 font-semibold">
                    Share
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div
                  className={`flex flex-col items-center justify-center text-sm ${
                    isLiked ? "bg-black" : "bg-blue-500"
                  } hover:bg-blue1 transform duration-300 cursor-pointer w-12 p-4 h-12 rounded-full like-button ${
                    liking ? 'opacity-70' : ''
                  }`}
                  onClick={handleLike}
                >
                  {!isLiked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0.5 0.5 16 16"
                      className={`like-button ${isLiked ? "liked" : ""}`}
                    >
                      <path fill="none" d="M.5.5h16v16H.5z"></path>
                      <path
                        fill="#fff"
                        d="M.5 7.5h3v8h-3zM7.207 15.207c.193.19.425.29.677.293H12c.256 0 .512-.098.707-.293l2.5-2.5c.19-.19.288-.457.293-.707V8.5c0-.553-.445-1-1-1h-5L11 5s.5-.792.5-1.5v-1c0-.553-.447-1-1-1l-1 2-4 4v6l1.707 1.707z"
                      ></path>
                    </svg>
                  )}
                </div>
                <div className="flex justify-center">
                  <h1 className="text-sm sm:text-gray-400 font-semibold text-white">
                    {isLiked ? "Liked" : "Like"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
