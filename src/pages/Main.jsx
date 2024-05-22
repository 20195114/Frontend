import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa"; 
import { IoClose } from "react-icons/io5";
import { BsSkipStartBtn } from "react-icons/bs";
import { IoLogoOctocat } from "react-icons/io5"; 
import { FaUser } from "react-icons/fa";
import './Main.css';

const Main = () => {
  const [state, setState] = useState({
    myWatchedVods: [],
    popularVods: [],
    youtubeTrendsVods: [],
    searchBasedVods: [],
    ratingBasedVods: [],
    spotifyVods: [],
    isSpotifyLinked: false,
    user_name: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false); // 사용자 메뉴 보이기/숨기기 상태
  const [users, setUsers] = useState([]); // 유저 리스트 상태

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user_name = localStorage.getItem('selectedUserName');
    const user_id = localStorage.getItem('selectedUserId');
    const storedUsers = JSON.parse(localStorage.getItem('user_list') || '[]');
    setUsers(storedUsers);

    if (user_id) {
      fetchVodData(user_id);
      checkAndFetchVods(user_id);
    }
    if (user_name) {
      setState(prevState => ({ ...prevState, user_name: user_name }));
    }
  }, []);

  const fetchVodData = async (user_id) => {
    try {
      const [
        myWatchedVodsResponse,
        popularVodsResponse,
        youtubeTrendsVodsResponse,
        searchBasedVodsResponse,
        ratingBasedVodsResponse,
        spotifyVodsResponse
      ] = await Promise.all([
        axios.get(`/my-watched-vods?userId=${user_id}`),
        axios.get(`/popular-vods?userId=${user_id}`),
        axios.get(`/youtube-trends-vods?userId=${user_id}`),
        axios.get(`/search-based-vods?userId=${user_id}`),
        axios.get(`/rating-based-vods?userId=${user_id}`),
        axios.get(`/spotifyVods?user_id=${user_id}`)
      ]);

      setState(prevState => ({
        ...prevState,
        myWatchedVods: myWatchedVodsResponse.data,
        popularVods: popularVodsResponse.data,
        youtubeTrendsVods: youtubeTrendsVodsResponse.data,
        searchBasedVods: searchBasedVodsResponse.data,
        ratingBasedVods: ratingBasedVodsResponse.data,
        spotifyVods: spotifyVodsResponse.data
      }));
    } catch (error) {
      console.error('Error fetching VOD data:', error);
    }
  };

  const checkAndFetchVods = async (user_id) => {
    try {
      const linkResponse = await axios.post(`/mainpage/spotify/${user_id}/userinfo`);
      if (linkResponse.data.status) {
        fetchSpotifyVods(user_id);
      } else {
        window.open(linkResponse.data.spotifyLink, '_blank');
      }
    } catch (error) {
      console.error('Error checking Spotify link status:', error);
    }
  };

  const fetchSpotifyVods = async (user_id) => {
    try {
      const response = await axios.get(`/mainpage/spotify/${user_id}`);
      if (response.data.status) {
        setState(prevState => ({
          ...prevState,
          spotifyVods: response.data.response
        }));
      } else {
        console.error("Failed to fetch Spotify VODs: No data available");
      }
    } catch (error) {
      console.error('Error fetching Spotify VODs:', error);
    }
  };

  const handlePosterClick = (vod_id) => {
    axios.post('/vod-detail', { vod_id })
      .then(response => {
        navigate(`/MovieDetailPage/${vod_id}`);
      })
      .catch(error => {
        console.error('Error posting VOD ID:', error);
      });
  };

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

  const displayVods = (vods) => {
    return (
      <div className="vod-slider">
        {vods.map((vod, index) => (
          <div key={index} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
            <img src={vod.POSTER_URL || 'default-poster.jpg'} alt={vod.TITLE} />
          </div>
        ))}
      </div>
    );
  };

  const handleCategoryClick = () => {
    navigate('/Movie', { state: { movies: state.myWatchedVods } });
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
            <Link to="/Movie" className="category" onClick={handleCategoryClick}>영화</Link>
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
      <div className="trailer-container">
        <video autoPlay loop muted>
          <source src="/TrailVideo.mp4" type="video/mp4" />
          예고편
        </video>
      </div>

      <h2>'{state.user_name}'님 맞춤 추천</h2>
      <div className="vod-container">
        {state.myWatchedVods.length > 0 ? displayVods(state.myWatchedVods) : <p>Loading...</p>}
      </div>

      <h2>최근 유튜브 트렌드</h2>
      <div className="vod-container">
        {state.youtubeTrendsVods.length > 0 ? displayVods(state.youtubeTrendsVods) : <p>Loading...</p>}
      </div>

      <h2>인기 컨텐츠</h2>
      <div className="vod-container">
        {state.popularVods.length > 0 ? displayVods(state.popularVods) : <p>Loading...</p>}
      </div>

      <h2>검색 기반 추천</h2>
      <div className="vod-container">
        {state.searchBasedVods.length > 0 ? displayVods(state.searchBasedVods) : <p>Loading...</p>}
        </div>
        <h2>별점 기반 추천</h2>
        <div className="vod-container">
          {state.ratingBasedVods.length > 0 ? displayVods(state.ratingBasedVods) : <p>Loading...</p>}
          </div>
          
        <h2>Spotify 감정 추천</h2>
        <div className="vod-container">
          {state.spotifyVods.length > 0 ? displayVods(state.spotifyVods) : <p>Loading...</p>}
          </div>
          </div>
          );
        };
        export default Main;