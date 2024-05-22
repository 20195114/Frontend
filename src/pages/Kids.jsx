import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Movie.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"; 
import { IoClose } from "react-icons/io5";
import { BsSkipStartBtn } from "react-icons/bs";
import { IoLogoOctocat } from "react-icons/io5"; 
import { FaUser } from "react-icons/fa";

const Kids = () => {
  const navigate = useNavigate();  // navigate 사용
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [users, setUsers] = useState([]);  // users 상태 추가
  const [movies, setMovies] = useState([]);  // movies 상태 추가
  const [state, setState] = useState({ myWatchedVods: [] });  // state 상태 추가
  const searchInputRef = useRef(null);  // useRef 사용

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('user_list') || '[]');
    setUsers(storedUsers);
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      const response = await axios.post('/api/movies', { category: 'kids' });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  // const displayMovies = () => {
  //   return movies.map((movie, index) => (
  //     <div key={index} className="movie-item">
  //       <img src={movie.POSTER_URL || 'default-poster.jpg'} alt={movie.TITLE} />
  //       <h3>{movie.TITLE}</h3>
  //     </div>
  //   ));
  // };

  // const handlePosterClick = (vod_id) => {
  //   axios.post('/vod-detail', { vod_id })
  //     .then(response => {
  //       navigate(`/MovieDetailPage/${vod_id}`);
  //     })
  //     .catch(error => {
  //       console.error('Error posting VOD ID:', error);
  //     });
  // };

  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await axios.get(`/search-vods?query=${query}`);
        setSearchResults(response.data.slice(0, 5)); // 검색 결과를 최대 5개까지 제한
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
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
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/MovieDetailPage/${vod_id}`);
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.post('/search-vods', { query: searchQuery });
        navigate('/SearchBar', { state: { searchResults: response.data } });
      } catch (error) {
        console.error('Error searching VODs:', error);
      }
    }
  };

  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const handleUserChange = (user_id, user_name) => {
    localStorage.setItem('selectedUserId', user_id);
    localStorage.setItem('selectedUserName', user_name);
    setState(prevState => ({ ...prevState, user_name: user_name }));
    setUserMenuVisible(false);
    navigate('/Main');
  };

  const goToMainPage = () => {
    navigate('/Main');
  };

  return (
    <div className='body'>
      <header className="header">
        <div className="logo-container">
        <h1 className="logo" onClick={goToMainPage}>Hell:D</h1>
          <div className="category-container">
            <Link to="/Movie" className="category">영화</Link>
            <Link to="/Series" className="category">시리즈</Link>
            <Link to="/Kids" className="category">키즈</Link>
          </div>
        </div>
        <div className="icons-container">
          <div className="search-container">
            <FaSearch
              className="search-icon"
              onClick={handleSearchIconClick}
              style={{ display: searchActive ? 'none' : 'block' }}
            />
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchSubmit}
              ref={searchInputRef}
              placeholder="제목, 배우, 장르 검색"
              style={{ opacity: searchActive ? 1 : 0 }}
            />
            <IoClose 
              className="close-icon"
              onClick={handleCloseIconClick}
              style={{ display: searchActive ? 'block' : 'none' }}
            />
          </div>
          <div className="playlist-container">
            <BsSkipStartBtn
              className="play-icon"
              onClick={togglePlaylistVisibility}
            />
            {playlistVisible && (
              <div className="playlist-box active">
                {state.myWatchedVods.slice(0, 3).map((vod, index) => (
                  <div key={index} className="playlist-item">
                    <img src={vod.POSTER_URL || 'default-poster.jpg'} alt={vod.TITLE} />
                    <p>{vod.TITLE}</p> 
                  </div>
                ))}
                <div className="more" onClick={() => navigate('/Playlist')}>
                  더보기
                </div>
              </div>
            )}
          </div>
          <div className="user-container">
            <FaUser
              className="user-icon"
              onClick={toggleUserMenuVisibility}
            />
            {userMenuVisible && (
              <div className="user-menu active">
                {users.map(user => (
                  <div key={user.user_id} className="user-menu-item" onClick={() => handleUserChange(user.user_id, user.user_name)}>
                    <IoLogoOctocat className="user-icon-small" />
                    <p>{user.user_name}</p>
                  </div>
                ))}
                <div className="user-menu-item" onClick={() => navigate('/User')}>
                  <p>내 정보 수정</p>
                </div>
                <div className="user-menu-item" onClick={() => navigate('/LoginComponent')}>
                <p>로그아웃</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {searchActive && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <p key={index} onClick={() => handleSearchResultClick(result.VOD_ID)}>
                {result.TITLE}
              </p>
            ))}
          </div>
        )}
      </header>
    </div>
  );
};

export default Kids;
