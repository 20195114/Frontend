import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../CSS/Kids.css';
import Header from '../Component/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper functions for localStorage
const getLocalStorageData = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage data for ${key}:`, error);
    return defaultValue;
  }
};

const setLocalStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting localStorage data for ${key}:`, error);
  }
};

const Kids = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    myWatchedVods: getLocalStorageData('myWatchedVods', []),
    likeStatus: JSON.parse(localStorage.getItem('likeStatus')) || false, // 추가된 상태
  });
  const [vods, setVods] = useState(getLocalStorageData('kidsVods', []));
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('popular');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false); // 추가된 상태

  // Function to fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/kids/${sortOption === 'popular' ? 'popularlist' : 'recentlylist'}`);
      const vodsData = Array.isArray(response.data) ? response.data : [];
      setVods(vodsData);
      setLocalStorageData('kidsVods', vodsData);
    } catch (error) {
      console.error('Failed to fetch VODs:', error);
    } finally {
      setLoading(false);
    }
  }, [sortOption]);

  // Fetch data on component mount and sortOption change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToMainPage = () => {
    navigate('/Main');
  };

  const handleCategoryClick = (e) => {
    const category = e.target.textContent;
    navigate(`/${category}`);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/search-vods`, { query: searchQuery });
        const results = Array.isArray(response.data) ? response.data : [];
        setSearchResults(results);
        navigate('/SearchBar', { state: { searchResults: results } });
      } catch (error) {
        console.error('Error searching VODs:', error);
      }
    }
  };

  const handleSearchResultClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };

  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
  };

  const handlePosterClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };

  return (
    <div className='kids-page'>
      <Header 
        state={state} 
        setState={setState} 
        users={[]} 
        setUsers={() => {}} 
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchInputRef={searchInputRef}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchResultClick={handleSearchResultClick}
        toggleUserMenuVisibility={toggleUserMenuVisibility}
        userMenuVisible={userMenuVisible}
        togglePlaylistVisibility={togglePlaylistVisibility}
        playlistVisible={playlistVisible}
        handleCategoryClick={handleCategoryClick}
        goToMainPage={goToMainPage}
        likeVisible={likeVisible} // 추가된 프로퍼티
        setLikeVisible={setLikeVisible} // 추가된 프로퍼티
      />

      <div className='vod-container'>
        <h2>키즈</h2>
        <div className='sort-options'>
          <button className={`sort-option ${sortOption === 'popular' ? 'active' : ''}`} onClick={() => handleSortOptionChange('popular')}>
            인기순
          </button>
          <button className={`sort-option ${sortOption === 'recent' ? 'active' : ''}`} onClick={() => handleSortOptionChange('recent')}>
            최신순
          </button>
        </div>
        <div className='movie-list'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            vods.length === 0 ? (
              <p>영화가 없습니다.</p>
            ) : (
              vods.map((vod) => (
                <div key={vod.VOD_ID} className='movie-item' onClick={() => handlePosterClick(vod.VOD_ID)}>
                  <img src={vod.POSTER || '../URL/defaultPoster.png'} alt={vod.TITLE} />
                  <p>{vod.TITLE}</p>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Kids;
