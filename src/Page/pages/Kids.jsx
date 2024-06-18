import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../CSS/Kids.css';
import Header from '../Component/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

// 쿠키에서 데이터를 가져오고 기본 값을 설정하는 함수
const getCookieData = (key, defaultValue) => {
  const value = Cookies.get(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing cookie data for ${key}:`, error);
    return defaultValue;
  }
};

// 쿠키에 데이터를 설정하는 함수
const setCookieData = (key, data) => {
  try {
    Cookies.set(key, JSON.stringify(data), { expires: 1 });
  } catch (error) {
    console.error(`Error setting cookie data for ${key}:`, error);
  }
};

const Kids = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ myWatchedVods: getCookieData('myWatchedVods', []) });
  const [vods, setVods] = useState(getCookieData('kidsVods', []));
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('popular');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);

  // 데이터 가져오기 함수
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/kids/${sortOption === 'popular' ? 'popularlist' : 'recentlylist'}`);
      const vodsData = response.data || [];
      setVods(vodsData);
      setCookieData('kidsVods', vodsData);
    } catch (error) {
      console.error('Failed to fetch VODs:', error);
    } finally {
      setLoading(false);
    }
  }, [sortOption]);

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

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      navigate('/SearchBar', { state: { query: searchQuery } });
    }
  };

  const handleSearchResultClick = (vod_id) => {
    navigate(`/MovieDetail/${vod_id}`);
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
                  <img src={vod.POSTER || 'default-poster.jpg'} alt={vod.TITLE} />
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
