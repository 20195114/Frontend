import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../Component/Header';
import MyWatchedVods from '../Component/MyWatchedVods';
import YouTubeTrends from '../Component/YouTubeTrends';
import PopularVods from '../Component/PopularVods';
import RatingBasedVods from '../Component/RatingBasedVods';
import Spotify from '../Component/Spotify';
import '../CSS/Main.css';

const Main = () => {
  // 쿠키에서 데이터를 가져올 때 기본 값을 사용
  const getCookieData = (key, defaultValue) => {
    const value = Cookies.get(key);
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error parsing cookie data for ${key}:`, error);
      return defaultValue;
    }
  };

  const [state, setState] = useState({
    myWatchedVods: getCookieData('myWatchedVods', []),
    youtubeTrendsVods: getCookieData('youtubeTrendsVods', []),
    popularVods: getCookieData('popularVods', []),
    searchBasedVods: getCookieData('searchBasedVods', []),
    ratingBasedVods: getCookieData('ratingBasedVods', []),
    spotifyVods: getCookieData('spotifyVods', []),
    isSpotifyLinked: false,
    user_name: Cookies.get('selectedUserName') || 'User Name'
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    myWatchedVods: false,
    youtubeTrendsVods: false,
    popularVods: false,
    searchBasedVods: false,
    ratingBasedVods: false,
    spotifyVods: false,
  });

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (url, key, user_id = null) => {
    setLoading(prevState => ({ ...prevState, [key]: true }));
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${url}${user_id ? `/${user_id}` : ''}`);
      
      if (key === 'spotifyVods') {
        if (response.data.status === false) {
          const spotifyAuthResponse = await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/spotify/${user_id}`);
          const spotifyAuthUrl = spotifyAuthResponse.data.response;
          const newWindow = window.open(spotifyAuthUrl, '_blank', 'width=500,height=600');

          const interval = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(interval);
              fetchData('/mainpage/vodlist/spotify', 'spotifyVods', user_id);
            }
          }, 1000);
        } else {
          setState(prevState => ({ ...prevState, [key]: response.data.vods }));
          Cookies.set(key, JSON.stringify(response.data.vods), { expires: 1 });
        }
      } else {
        setState(prevState => ({ ...prevState, [key]: response.data }));
        Cookies.set(key, JSON.stringify(response.data), { expires: 1 });
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    } finally {
      setLoading(prevState => ({ ...prevState, [key]: false }));
    }
  }, []);

  const loadUserData = useCallback((user_id) => {
    fetchData('/mainpage/home/watch', 'myWatchedVods', user_id);
    fetchData('/mainpage/home/youtube', 'youtubeTrendsVods', user_id);
    fetchData('/mainpage/home/popular', 'popularVods');
    fetchData('/mainpage/home/rating', 'ratingBasedVods', user_id);
    fetchData('/mainpage/home/spotify', 'spotifyVods', user_id);
  }, [fetchData]);

  useEffect(() => {
    const user_name = Cookies.get('selectedUserName');
    const user_id = Cookies.get('selectedUserId');
    const storedUsers = getCookieData('user_list', []);
    setUsers(storedUsers);

    if (user_id) {
      loadUserData(user_id);
    }
    if (user_name) {
      setState(prevState => ({ ...prevState, user_name }));
    }
  }, [loadUserData]);

  const handlePosterClick = (vod_id) => {
    const user_id = Cookies.get('selectedUserId');
    navigate(`/MovieDetailPage`, { state: { vod_id, user_id } });
  };

  const handleSearchResultClick = (vod_id) => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    const user_id = Cookies.get('selectedUserId');
    navigate(`/MovieDetailPage`, { state: { vod_id, user_id } });
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/search-vods`, { query: searchQuery });
        const user_id = Cookies.get('selectedUserId');
        navigate('/SearchBar', { state: { searchResults: response.data, user_id } });
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
    Cookies.set('selectedUserId', user_id, { expires: 1 });
    Cookies.set('selectedUserName', user_name, { expires: 1 });
    setState(prevState => ({ ...prevState, user_name }));
    setUserMenuVisible(false);
    loadUserData(user_id);
    navigate('/Main');
  };

  const handleCategoryClick = () => {
    navigate('/Movie', { state: { movies: state.myWatchedVods } });
  };

  const goToMainPage = () => {
    navigate('/Main');
  };

  return (
    <div className='body'>
      <Header 
        state={state}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        users={users}
        handleSearchInputChange={() => {}}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchResultClick={handleSearchResultClick}
        togglePlaylistVisibility={togglePlaylistVisibility}
        playlistVisible={playlistVisible}
        toggleUserMenuVisibility={toggleUserMenuVisibility}
        userMenuVisible={userMenuVisible}
        handleUserChange={handleUserChange}
        handleCategoryClick={handleCategoryClick}
        goToMainPage={goToMainPage}
        searchInputRef={searchInputRef}
      />
      <div className="trailer-container">
        <video autoPlay loop muted>
          <source src="/TrailVideo.mp4" type="video/mp4" />
          예고편
        </video>
      </div>

      <MyWatchedVods 
        vods={state.myWatchedVods} 
        handlePosterClick={handlePosterClick} 
        user_name={state.user_name} 
        loading={loading.myWatchedVods}
      />
      <PopularVods 
        vods={state.popularVods} 
        handlePosterClick={handlePosterClick} 
        loading={loading.popularVods}
      />
       <YouTubeTrends 
        vods={state.youtubeTrendsVods} 
        handlePosterClick={handlePosterClick} 
        loading={loading.youtubeTrendsVods}
      />
      <Spotify 
        vods={state.spotifyVods} 
        handlePosterClick={handlePosterClick} 
        loading={loading.spotifyVods}
      />
       <RatingBasedVods 
        vods={state.ratingBasedVods} 
        handlePosterClick={handlePosterClick} 
        loading={loading.ratingBasedVods}
      />
    </div>
  );
};

export default Main;
