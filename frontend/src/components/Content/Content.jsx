/* eslint-disable no-unused-vars */
import { Eye, Folder, FolderClosed, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import PopupSign from "../Footer/PopupSign";
import { useAppState } from "../../context/Context";
import Modal from "./Modal";
import { HOST } from "../../data";
import apiClient from "../../services/apiClient";
const ContentCard = ({ onCreatorClick, ...item }) => {
  const {openModal, setOpenModal} = useAppState(false);
  const { isAuthenticated, setLoginActive } = useAppState();
  const [hoveredImage, setHoveredImage] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes || 0);
  const [liking, setLiking] = useState(false);

  // Check if user has liked this card on mount
  useEffect(() => {
    if (isAuthenticated && item._id && item.likedBy) {
      const userLiked = item.likedBy.some(likedUserId => {
        // Note: Frontend would need user ID from context
        return true; // This will be properly implemented when context has user._id
      });
      setIsLiked(userLiked);
    }
  }, [isAuthenticated, item._id, item.likedBy]);

  const onMouseEnter = () => {
    setHoveredImage(true);
  }
  const onMouseLeave = () => {
    setHoveredImage(false);
  }

  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setLoginActive(true);
      return;
    }

    setLiking(true);
    try {
      const result = await apiClient.likeCard(item._id);
      if (result.success) {
        setIsLiked(result.data.liked);
        setLikes(result.data.likes);
      }
    } catch (error) {
      console.error('Error liking card:', error);
    } finally {
      setLiking(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex vignette relative"
        onClick={() => {
          setOpenModal(true);
          localStorage.setItem("item", JSON.stringify(item));
        }}
      >
        <img
          // src={item.images[(Math.random() * item.images.length) | 0]}
          src={item.images[0]}
          alt="random"
          className="rounded-md w-[22rem] h-[16rem] object-cover"
          width={400}
          height={400}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {hoveredImage && (
          <div
          onMouseEnter={onMouseEnter}
            className="font-bold absolute top-2 left-2 z-10 flex justify-center items-center
          w-[5.5rem] text-sm text-white bg-gray-800 rounded-2xl
          "
          >
            <button className="p-2 rounded-full flex items-center justify-center gap-2">
              <FolderClosed size={16} className="" />
              <h1>Save</h1>
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex">
            <h1 className="font-bold">{item.imageTitle}</h1>
          </div>
          <div className="flex gap-3 text-sm">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex gap-1 items-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                isLiked ? 'text-blue-500' : 'text-gray-500'
              } ${liking ? 'opacity-50' : ''}`}
              title={isAuthenticated ? 'Click to like' : 'Login to like'}
            >
              <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
              <h1 className="font-bold">
                {likes > 1000
                  ? `${(likes / 1000).toFixed(1)}k`
                  : likes}
              </h1>
            </button>
            <div className="flex gap-1 items-center text-gray-500">
              <Eye size={16} className="text-gray-500" />
              <h1 className="font-bold">
                {item.views > 1000
                  ? `${(item.views / 1000).toFixed(1)}k`
                  : item.views}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            type="button"
            className="text-sm text-gray-500 mt-[-2px] hover:text-black"
            onClick={(e) => {
              e.stopPropagation();
              if (onCreatorClick) onCreatorClick(item.creatorName);
            }}
          >
            {item.creatorName}
          </button>
        </div>
      </div>
    </div>
  );

};
const Content = () => {
  const { 
    recommendedStates, 
    setRecommendedStates,
    searchQuery,
    setSearchQuery,
    signupActive,
    openModal, 
    setOpenModal,
    activeFilters,
    setActiveFilters,
    setCurrentPage,
    setSelectedCreator
  } = useAppState();
  
  const [Cardsdata, setCardsData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [creatorProfileOpen, setCreatorProfileOpen] = useState(false);
  const [creatorProfileName, setCreatorProfileName] = useState("");
  const [creatorProfileCards, setCreatorProfileCards] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await apiClient.getAllCards();
      console.log('API Response:', result);
      if(result.success){
        console.log('Setting cards data:', result.data.properties);
        setCardsData(result.data.properties);
        setOriginalData(result.data.properties);
      } else {
        console.error('Failed to fetch cards:', result.error);
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    // Check if any filters are active
    const hasFilters = Object.values(activeFilters).some(arr => arr && arr.length > 0);
    
    if (searchQuery && searchQuery.trim() !== "") {
      // Perform search with filters via API
      const performSearch = async () => {
        const result = await apiClient.searchCards(searchQuery, activeFilters);
        if(result.success){
          setCardsData(result.data.properties);
        }
      }
      performSearch();
    } else if (hasFilters) {
      // Apply filters only via API
      const performSearch = async () => {
        const result = await apiClient.searchCards("", activeFilters);
        if(result.success){
          setCardsData(result.data.properties);
        }
      }
      performSearch();
    } else if (recommendedStates !== "") {
      const filtered = originalData.filter((item) =>
        item.sort_by.includes(recommendedStates)
      );
      setCardsData(filtered.map((item) => item));
    } else {
      setCardsData(originalData.map((item) => item));
    }
  }, [searchQuery, activeFilters, recommendedStates, originalData]);

  const handleOpenCreatorProfile = (name) => {
    if (!name) return;
    const filtered = originalData.filter((item) => item.creatorName === name);
    setCreatorProfileName(name);
    setCreatorProfileCards(filtered);
    setCreatorProfileOpen(true);
  };

  const navigateToCreatorProfile = (creatorName) => {
    if (!creatorName) return;
    setCreatorProfileName(creatorName);
    const filtered = originalData.filter((item) => item.creatorName === creatorName);
    setCreatorProfileCards(filtered);
    setOpenModal(false);
    setCreatorProfileOpen(false);
    setSelectedCreator(creatorName);
    setCurrentPage('profile');
  };

  const handleCloseCreatorProfile = () => {
    setCreatorProfileOpen(false);
  };
  return (
    <>
      <div className={`flex flex-col gap-8`}>
        <div className="flex flex-wrap gap-4">
          {Cardsdata.map((item, index) => (
            <ContentCard key={index} {...item} onCreatorClick={navigateToCreatorProfile} />
          ))}
        </div>
        {signupActive && <PopupSign />}
        {openModal && 
        <div className="flex relative top-0 right-0">
          <Modal/>
          </div>
          }
      </div>

      {creatorProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[90%] max-w-5xl max-h-[85vh] rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex flex-col">
                <h2 className="font-bold text-lg text-black">{creatorProfileName}</h2>
                <span className="text-sm text-gray-500">{creatorProfileCards.length} projects</span>
              </div>
              <button
                type="button"
                className="text-gray-500 hover:text-black text-2xl leading-none"
                onClick={handleCloseCreatorProfile}
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-72px)]">
              <div className="flex flex-wrap gap-4">
                {creatorProfileCards.map((item, index) => (
                  <ContentCard key={`${item._id || index}-creator`} {...item} onCreatorClick={handleOpenCreatorProfile} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
