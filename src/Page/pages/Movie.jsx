import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import VODCategory from '../Component/VODCategory';
import '../CSS/Movie.css';

const getSessionStorageData = (key, defaultValue) => {
  const value = sessionStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing sessionStorage data for ${key}:`, error);
    return defaultValue;
  }
};

const setSessionStorageData = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting sessionStorage data for ${key}:`, error);
  }
};

const Movie = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    myWatchedVods: getSessionStorageData('myWatchedVods', []),
    likeStatus: JSON.parse(sessionStorage.getItem('likeStatus')) || false,
  });

  const [vodsByCategory, setVodsByCategory] = useState({
    SF: getSessionStorageData('SF', []),
    Education: getSessionStorageData('Education', []),
    Family: getSessionStorageData('Family', []),
    Horror: getSessionStorageData('Horror', []),
    Drama: getSessionStorageData('Drama', []),
    Romance: getSessionStorageData('Romance', []),
    Action: getSessionStorageData('Action', []),
    Animation: getSessionStorageData('Animation', []),
  });

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false); // 추가된 상태

  const fetchVods = useCallback(async (category, endpoint) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${endpoint}`);
      const vods = response.data || [];
      setVodsByCategory(prevState => ({
        ...prevState,
        [category]: vods
      }));
      setSessionStorageData(category, vods);
    } catch (error) {
      console.error(`Failed to fetch VODs for ${category}:`, error);
    }
  }, []);

  useEffect(() => {
    fetchVods('SF', '/mainpage/movie/SF-fantasy');
    fetchVods('Education', '/mainpage/movie/Liberal-Arts-Others');
    fetchVods('Family', '/mainpage/movie/family');
    fetchVods('Horror', '/mainpage/movie/horror');
    fetchVods('Drama', '/mainpage/movie/drama');
    fetchVods('Romance', '/mainpage/movie/romance');
    fetchVods('Action', '/mainpage/movie/action');
    fetchVods('Animation', '/mainpage/movie/animations');
  }, [fetchVods]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/search-vods`, { query: searchQuery });
        navigate('/SearchBar', { state: { searchResults: response.data } });
      } catch (error) {
        console.error('Error searching VODs:', error);
      }
    }
  };

  const handleSearchResultClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
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
        handleSearchResultClick={handleSearchResultClick}
        toggleUserMenuVisibility={() => setUserMenuVisible(!userMenuVisible)}
        userMenuVisible={userMenuVisible}
        togglePlaylistVisibility={() => setPlaylistVisible(!playlistVisible)}
        playlistVisible={playlistVisible}
        handleCategoryClick={(e) => navigate(`/${e.target.textContent}`)}
        goToMainPage={goToMainPage}
        likeVisible={likeVisible} 
        setLikeVisible={setLikeVisible} 
      />

      <div className='vod-container'>
        <VODCategory title="SF/판타지" vods={vodsByCategory.SF || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="기타/교양" vods={vodsByCategory.Education || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="가족" vods={vodsByCategory.Family || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="공포" vods={vodsByCategory.Horror || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="드라마" vods={vodsByCategory.Drama || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="로맨스" vods={vodsByCategory.Romance || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="액션" vods={vodsByCategory.Action || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="애니메이션" vods={vodsByCategory.Animation || []} handlePosterClick={handleSearchResultClick} />
      </div>
    </div>
  );
};

export default Movie;
