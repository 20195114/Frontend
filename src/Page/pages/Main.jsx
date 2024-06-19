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
    likeStatus: JSON.parse(localStorage.getItem('likeStatus')) || false,
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

  const fetchSpotifyStatus = useCallback(async (user_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/home/spotify/${user_id}`);
      const data = response.data;

      if (data.status && data.response !== false) {
        // Spotify is already linked and VOD data is available
        setState((prevState) => ({
          ...prevState,
          spotifyVods: data.response,
          isSpotifyLinked: true,
        }));
        setLocalStorageData('spotifyVods', data.response);
      } else if (data.status && data.response === false) {
        // Spotify needs to be linked
        const authResponse = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/mainpage/spotify/${user_id}`);
        const spotifyAuthUrl = authResponse.data.response;
        const newWindow = window.open(spotifyAuthUrl, '_blank', 'width=500,height=600');

        const checkAuthStatus = setInterval(async () => {
          if (newWindow.closed) {
            clearInterval(checkAuthStatus);
            // Check if the user has completed the Spotify linking process
            const updatedResponse = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/home/spotify/${user_id}`);
            const updatedData = updatedResponse.data;
            if (updatedData.status && updatedData.response !== false) {
              setState((prevState) => ({
                ...prevState,
                spotifyVods: updatedData.response,
                isSpotifyLinked: true,
              }));
              setLocalStorageData('spotifyVods', updatedData.response);
            } else {
              console.error('Spotify authorization failed or not completed.');
            }
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking Spotify status:', error);
    }
  }, []);

  const fetchData = useCallback(async (url, key, user_id = null) => {
    setLoading((prevState) => ({ ...prevState, [key]: true }));
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${url}${user_id ? `/${user_id}` : ''}`);
      const data = response.data;

      if (key !== 'spotifyVods') {
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
      fetchData('/mainpage/home/popular', 'popularVods', user_id);
      fetchData('/mainpage/home/rating', 'ratingBasedVods', user_id);
      fetchSpotifyStatus(user_id);
    },
    [fetchData, fetchSpotifyStatus]
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
    const { userId, userName, likeStatus } = user;

    localStorage.setItem('selectedUserId', userId);
    localStorage.setItem('selectedUserName', userName);
    localStorage.setItem('likeStatus', JSON.stringify(likeStatus));

    setState((prevState) => ({
      ...prevState,
      user_name: userName,
      likeStatus: likeStatus
    }));

    loadUserData(userId);
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
