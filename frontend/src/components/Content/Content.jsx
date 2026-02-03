/* eslint-disable no-unused-vars */
import { Eye, Folder, FolderClosed, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import PopupSign from "../Footer/PopupSign";
import { useAppState } from "../../context/Context";
import Modal from "./Modal";
import apiClient from "../../services/apiClient";
const ContentCard = ({ onCreatorClick, ...item }) => {
  const { openModal, setOpenModal, user } = useAppState(false);
  const { isAuthenticated, setLoginActive } = useAppState();
  const [hoveredImage, setHoveredImage] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(item?.stats?.appreciationsCount || item?.appreciationsCount || 0);
  const [liking, setLiking] = useState(false);

  // Check if user has liked this card on mount
  useEffect(() => {
    if (isAuthenticated && user?._id && item?._id && Array.isArray(item.appreciations)) {
      const userLiked = item.appreciations.some(
        (likedUserId) => likedUserId === user._id || likedUserId?._id === user._id
      );
      setIsLiked(userLiked);
    }
  }, [isAuthenticated, item?._id, item?.appreciations, user?._id]);

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

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    setLiking(true);
    try {
      const result = await apiClient.appreciateProject(item._id);
      if (result.success) {
        const updatedLikes =
          result.data?.data?.stats?.appreciationsCount ??
          result.data?.data?.appreciationsCount;
        if (typeof updatedLikes === 'number') {
          setLikes(updatedLikes);
        }
      } else {
        setIsLiked(!nextLiked);
        setLikes((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
      }
    } catch (error) {
      setIsLiked(!nextLiked);
      setLikes((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
      console.error('Error appreciating project:', error);
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
          src={item?.coverImage?.url || item?.modules?.find((m) => m.type === 'image')?.image?.url}
          alt={item?.title || 'project'}
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
            <h1 className="font-bold">{item.title}</h1>
          </div>
          <div className="flex gap-3 text-sm">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex gap-1 items-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
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
                {item?.stats?.views > 1000
                  ? `${(item.stats.views / 1000).toFixed(1)}k`
                  : item?.stats?.views || 0}
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
              if (onCreatorClick) onCreatorClick(item?.owner?.username || item?.owner?.displayName);
            }}
          >
            {item?.owner?.displayName || item?.owner?.username}
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
      const result = await apiClient.getAllProjects(1, 24);
      if (result.success) {
        const projects = result.data?.data || [];
        setCardsData(projects);
        setOriginalData(projects);
      } else {
        console.error('Failed to fetch projects:', result.error);
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    // Check if any filters are active
    const hasFilters = Object.values(activeFilters).some(arr => arr && arr.length > 0);
    
    if (searchQuery && searchQuery.trim() !== "") {
      const performSearch = async () => {
        const result = await apiClient.getAllProjects(1, 24, {
          search: searchQuery,
          field: activeFilters.creative_fields,
          tool: activeFilters.tools,
          color: activeFilters.color
        });
        if (result.success) {
          setCardsData(result.data?.data || []);
        }
      }
      performSearch();
    } else if (hasFilters) {
      const performSearch = async () => {
        const result = await apiClient.getAllProjects(1, 24, {
          field: activeFilters.creative_fields,
          tool: activeFilters.tools,
          color: activeFilters.color
        });
        if (result.success) {
          setCardsData(result.data?.data || []);
        }
      }
      performSearch();
    } else if (recommendedStates !== "") {
      const sort = recommendedStates.toLowerCase().includes('appreciated')
        ? 'most-appreciated'
        : recommendedStates.toLowerCase().includes('view')
          ? 'popular'
          : undefined;

      const performSort = async () => {
        const result = await apiClient.getAllProjects(1, 24, {
          sort
        });
        if (result.success) {
          setCardsData(result.data?.data || []);
        }
      };
      performSort();
    } else {
      setCardsData(originalData.map((item) => item));
    }
  }, [searchQuery, activeFilters, recommendedStates, originalData]);

  const handleOpenCreatorProfile = (name) => {
    if (!name) return;
    const filtered = originalData.filter((item) => item?.owner?.username === name || item?.owner?.displayName === name);
    setCreatorProfileName(name);
    setCreatorProfileCards(filtered);
    setCreatorProfileOpen(true);
  };

  const navigateToCreatorProfile = (creatorName) => {
    if (!creatorName) return;
    setCreatorProfileName(creatorName);
    const filtered = originalData.filter((item) => item?.owner?.username === creatorName || item?.owner?.displayName === creatorName);
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
