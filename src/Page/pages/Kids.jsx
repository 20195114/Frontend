import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../CSS/Kids.css';
import Header from '../Component/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Kids = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ myWatchedVods: [] });
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('popular'); // 기본 정렬 옵션을 인기순으로 설정
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/kids/${sortOption === 'popular' ? 'popularlist' : 'recentlylist'}`);
      setVods(response.data || []);
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

  // const handleSearchIconClick = () => {
  //   setSearchActive(true);
  //   searchInputRef.current.focus();
  // };

  // const handleCloseIconClick = () => {
  //   setSearchActive(false);
  //   setSearchQuery('');
  //   setSearchResults([]);
  // };

  const handleSearchResultClick = (vod_id) => {
    navigate(`/MovieDetail/${vod_id}`);
  };

  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  // const handleUserChange = (user_id, user_name) => {
  //   // 사용자 변경 기능 추가
  // };

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
            vods.map((vod) => (
              <div key={vod.VOD_ID} className='movie-item' onClick={() => handlePosterClick(vod.VOD_ID)}>
                <img src={vod.POSTER || 'default-poster.jpg'} alt={vod.TITLE} />
                <p>{vod.TITLE}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Kids;
