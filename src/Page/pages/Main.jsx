import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header';
import MyWatchedVods from '../Component/MyWatchedVods';
import YouTubeTrends from '../Component/YouTubeTrends';
import PopularVods from '../Component/PopularVods';
import SearchBasedVods from '../Component/SearchBasedVods';
import RatingBasedVods from '../Component/RatingBasedVods';
import Spotify from '../Component/Spotify';
import '../CSS/Main.css';
import axios from 'axios';

const Main = () => {
  const [state, setState] = useState({
    myWatchedVods: [],
    youtubeTrendsVods: [],
    popularVods: [],
    searchBasedVods: [],
    ratingBasedVods: [],
    spotifyVods: [],
    isSpotifyLinked: false,
    user_name: 'User Name'
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchMyWatchedVods = useCallback(async (user_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/vodlist/watch/${user_id}`);
      setState(prevState => ({ ...prevState, myWatchedVods: response.data }));
    } catch (error) {
      console.error('Error fetching my watched VODs:', error);
    }
  }, []);

  const fetchYouTubeTrends = useCallback(async (user_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/vodlist/youtube/${user_id}`);
      setState(prevState => ({ ...prevState, youtubeTrendsVods: response.data }));
    } catch (error) {
      console.error('Error fetching YouTube trends:', error);
    }
  }, []);

  const fetchPopularVods = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/vodlist/popular`);
      setState(prevState => ({ ...prevState, popularVods: response.data }));
    } catch (error) {
      console.error('Error fetching popular VODs:', error);
    }
  }, []);

  const fetchSearchBasedVods = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/vodlist/search`);
      setState(prevState => ({ ...prevState, searchBasedVods: response.data }));
    } catch (error) {
      console.error('Error fetching search based VODs:', error);
    }
  }, []);

  const fetchRatingBasedVods = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/vodlist/rating`);
      setState(prevState => ({ ...prevState, ratingBasedVods: response.data }));
    } catch (error) {
      console.error('Error fetching rating based VODs:', error);
    }
  }, []);

  const fetchSpotifyVods = useCallback(async (user_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/mainpage/vodlist/spotify/${user_id}`);
      setState(prevState => ({ ...prevState, spotifyVods: response.data }));
    } catch (error) {
      console.error('Error fetching Spotify VODs:', error);
    }
  }, []);

  useEffect(() => {
    const user_name = localStorage.getItem('selectedUserName');
    const user_id = localStorage.getItem('selectedUserId');
    const storedUsers = JSON.parse(localStorage.getItem('user_list') || '[]');
    setUsers(storedUsers);

    if (user_id) {
      fetchMyWatchedVods(user_id);
      fetchYouTubeTrends(      user_id);
      fetchPopularVods();
      fetchSearchBasedVods();
      fetchRatingBasedVods();
      fetchSpotifyVods(user_id);
    }
    if (user_name) {
      setState(prevState => ({ ...prevState, user_name }));
    }
  }, [fetchMyWatchedVods, fetchYouTubeTrends, fetchPopularVods, fetchSearchBasedVods, fetchRatingBasedVods, fetchSpotifyVods]);

  const handlePosterClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };

  const handleSearchResultClick = (vod_id) => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/search-vods`, { query: searchQuery });
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
    setState(prevState => ({ ...prevState, user_name }));
    setUserMenuVisible(false);
    fetchMyWatchedVods(user_id);
    fetchYouTubeTrends(user_id);
    fetchPopularVods();
    fetchSearchBasedVods();
    fetchRatingBasedVods();
    fetchSpotifyVods(user_id);
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
      />
      <YouTubeTrends 
        vods={state.youtubeTrendsVods} 
        handlePosterClick={handlePosterClick} 
      />
      <PopularVods 
        vods={state.popularVods} 
        handlePosterClick={handlePosterClick} 
      />
      <SearchBasedVods 
        vods={state.searchBasedVods} 
        handlePosterClick={handlePosterClick} 
      />
      <RatingBasedVods 
        vods={state.ratingBasedVods} 
        handlePosterClick={handlePosterClick} 
      />
      <Spotify 
        vods={state.spotifyVods} 
        handlePosterClick={ handlePosterClick} 
      />
    </div>
  );
};

export default Main;

