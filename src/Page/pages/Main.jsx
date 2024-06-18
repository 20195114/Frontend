import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import MyWatchedVods from '../Component/MyWatchedVods';
import YouTubeTrends from '../Component/YouTubeTrends';
import PopularVods from '../Component/PopularVods';
import RatingBasedVods from '../Component/RatingBasedVods';
import Spotify from '../Component/Spotify';
import Like from '../Component/Like';
import '../CSS/Main.css';

const getLocalStorageData = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing local storage data for ${key}:`, error);
    return defaultValue;
  }
};

const setLocalStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting local storage data for ${key}:`, error);
  }
};

const Main = () => {
  const [state, setState] = useState({
    myWatchedVods: getLocalStorageData('myWatchedVods', []),
    youtubeTrendsVods: getLocalStorageData('youtubeTrendsVods', []),
    popularVods: getLocalStorageData('popularVods', []),
    ratingBasedVods: getLocalStorageData('ratingBasedVods', []),
    spotifyVods: getLocalStorageData('spotifyVods', []),
    isSpotifyLinked: false,
    user_name: localStorage.getItem('selectedUserName') || 'User Name',
    likeStatus: JSON.parse(localStorage.getItem('likeStatus')) // LIKE_STATUS 가져오기
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
    ratingBasedVods: false,
    spotifyVods: false,
  });
  const [likeVisible, setLikeVisible] = useState(false);

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (url, key, user_id = null) => {
    setLoading((prevState) => ({ ...prevState, [key]: true }));
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${url}${user_id ? `/${user_id}` : ''}`);
      const data = response.data;

      if (key === 'spotifyVods') {
        if (data.status === false) {
          const spotifyAuthResponse = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/mainpage/spotify/${user_id}`);
          const spotifyAuthUrl = spotifyAuthResponse.data.response;
          const newWindow = window.open(spotifyAuthUrl, '_blank', 'width=500,height=600');

          const interval = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(interval);
              fetchData('/mainpage/home/spotify', 'spotifyVods', user_id);
            }
          }, 1000);
        } else {
          setState((prevState) => ({ ...prevState, [key]: data.vods, isSpotifyLinked: true }));
          setLocalStorageData(key, data.vods);
        }
      } else {
        setState((prevState) => ({ ...prevState, [key]: data }));
        setLocalStorageData(key, data);
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    } finally {
      setLoading((prevState) => ({ ...prevState, [key]: false }));
    }
  }, []);

  const loadUserData = useCallback(
    (user_id) => {
      fetchData('/mainpage/home/watch', 'myWatchedVods', user_id);
      fetchData('/mainpage/home/youtube', 'youtubeTrendsVods', user_id);
      fetchData('/mainpage/home/popular', 'popularVods');
      fetchData('/mainpage/home/rating', 'ratingBasedVods', user_id);
      fetchData('/mainpage/home/spotify', 'spotifyVods', user_id);
    },
    [fetchData]
  );

  useEffect(() => {
    const user_name = localStorage.getItem('selectedUserName');
    const user_id = localStorage.getItem('selectedUserId');
    const storedUsers = getLocalStorageData('user_list', []);
    setUsers(storedUsers);

    if (user_id) {
      loadUserData(user_id);
    }
    if (user_name) {
      setState((prevState) => ({ ...prevState, user_name }));
    }
  }, [loadUserData]);

  const handlePosterClick = (vod_id) => {
    const user_id = localStorage.getItem('selectedUserId');
    navigate(`/MovieDetailPage`, { state: { vod_id, user_id } });
  };

  const handleSearchResultClick = (vod_id) => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    const user_id = localStorage.getItem('selectedUserId');
    navigate(`/MovieDetailPage`, { state: { vod_id, user_id } });
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/search-vods`, { query: searchQuery });
        const user_id = localStorage.getItem('selectedUserId');
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

  const handleUserChange = (user) => {
    const { userId, userName, likeStatus, vods } = user;

    localStorage.setItem('selectedUserId', userId);
    localStorage.setItem('selectedUserName', userName);
    localStorage.setItem('likeStatus', JSON.stringify(likeStatus));

    setState({
      myWatchedVods: vods.myWatchedVods,
      youtubeTrendsVods: vods.youtubeTrendsVods,
      popularVods: vods.popularVods,
      ratingBasedVods: vods.ratingBasedVods,
      spotifyVods: vods.spotifyVods,
      user_name: userName,
      likeStatus: likeStatus
    });
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

      {state.likeStatus ? (
        <>
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
          <Like
            isVisible={likeVisible}
            setIsVisible={setLikeVisible}
            closeOthers={() => { setPlaylistVisible(false); setUserMenuVisible(false); }}
            state={state}
            playlistVisible={playlistVisible}
            togglePlaylistVisibility={togglePlaylistVisibility}
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Main;
