import React, { useState, useEffect, useRef } from 'react';
import '../CSS/Movie.css';
import Header from '../Component/Header'; // 필요에 따라 경로를 조정하세요
import { useNavigate } from 'react-router-dom';

const Movie = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({ myWatchedVods: [] });
  const [vods, setVods] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);

  useEffect(() => {
    const fetchedVods = [
      { id: 1, poster: 'path_to_poster1.jpg', title: '파묘' },
      { id: 2, poster: 'path_to_poster2.jpg', title: '사바하' },
      { id: 3, poster: 'path_to_poster3.jpg', title: '검은 사제들' },
    ];
    setVods(fetchedVods);
  }, []);

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
      // Add search functionality here
      navigate('/SearchResults', { state: { query: searchQuery } });
    }
  };

  const handleSearchIconClick = () => {
    setSearchActive(true);
    searchInputRef.current.focus();
  };

  const handleCloseIconClick = () => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
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

  const handleUserChange = (user_id, user_name) => {
    // Add functionality for user change
  };

  return (
    <div className='body'>
      <Header 
        state={state} 
        setState={setState} 
        users={users} 
        setUsers={setUsers}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchInputRef={searchInputRef}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchIconClick={handleSearchIconClick}
        handleCloseIconClick={handleCloseIconClick}
        handleSearchResultClick={handleSearchResultClick}
        toggleUserMenuVisibility={toggleUserMenuVisibility}
        userMenuVisible={userMenuVisible}
        togglePlaylistVisibility={togglePlaylistVisibility}
        playlistVisible={playlistVisible}
        handleUserChange={handleUserChange}
        handleCategoryClick={handleCategoryClick}
        goToMainPage={goToMainPage}
      />
      <div className='vod-container'>
        <h2>추천 영화</h2>
        <div className='movie-list'>
          {vods.map((vod) => (
            <div key={vod.id} className='movie-item'>
              <img src={vod.poster} alt={vod.title} />
              <p>{vod.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Movie;
