import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import VODCategory from '../Component/VODCategory';
import '../CSS/Movie.css';

// Helper function to get data from sessionStorage
const getSessionStorageData = (key, defaultValue) => {
  const value = sessionStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing sessionStorage data for ${key}:`, error);
    return defaultValue;
  }
};

// Helper function to set data in sessionStorage
const setSessionStorageData = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting sessionStorage data for ${key}:`, error);
  }
};

const Series = () => {
  const [state, setState] = useState({
    actionFantasy: getSessionStorageData('actionFantasy', []),
    familyComedy: getSessionStorageData('familyComedy', []),
    drama: getSessionStorageData('drama', []),
    reality: getSessionStorageData('reality', []),
    likeStatus: JSON.parse(sessionStorage.getItem('likeStatus')) || false, // 추가된 상태
  });

  const [loading, setLoading] = useState({
    actionFantasy: false,
    familyComedy: false,
    drama: false,
    reality: false,
  });

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false); // 추가된 상태
  const navigate = useNavigate();

  // Function to fetch data from API
  const fetchData = useCallback(async (url, key) => {
    setLoading((prevState) => ({ ...prevState, [key]: true }));
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${url}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setState((prevState) => ({ ...prevState, [key]: data }));
      setSessionStorageData(key, data);
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      setState((prevState) => ({ ...prevState, [key]: [] }));
    } finally {
      setLoading((prevState) => ({ ...prevState, [key]: false }));
    }
  }, []);

  // Load data when component mounts
  useEffect(() => {
    fetchData('/mainpage/series/action-fantasy', 'actionFantasy');
    fetchData('/mainpage/series/family_comedy', 'familyComedy');
    fetchData('/mainpage/series/drama', 'drama');
    fetchData('/mainpage/series/reality', 'reality');
  }, [fetchData]);

  const handlePosterClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
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

  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  const handleCategoryClick = (e) => {
    const category = e.target.textContent;
    navigate(`/${category}`);
  };

  const goToMainPage = () => {
    navigate('/Main');
  };

  return (
    <div className='movie-page'>
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
        handleSearchResultClick={handlePosterClick}
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
        {loading.actionFantasy ? (
          <p>Loading 액션/판타지 VODs...</p>
        ) : (
          <VODCategory title="액션/판타지" vods={state.actionFantasy} handlePosterClick={handlePosterClick} />
        )}
        {loading.familyComedy ? (
          <p>Loading 가족/코미디 VODs...</p>
        ) : (
          <VODCategory title="가족/코미디" vods={state.familyComedy} handlePosterClick={handlePosterClick} />
        )}
        {loading.drama ? (
          <p>Loading 드라마 VODs...</p>
        ) : (
          <VODCategory title="드라마" vods={state.drama} handlePosterClick={handlePosterClick} />
        )}
        {loading.reality ? (
          <p>Loading 예능(리얼리티) VODs...</p>
        ) : (
          <VODCategory title="예능(리얼리티)" vods={state.reality} handlePosterClick={handlePosterClick} />
        )}
      </div>
    </div>
  );
};

export default Series;
//