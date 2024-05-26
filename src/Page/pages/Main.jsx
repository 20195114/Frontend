import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header'; // Ensure the path is correct
import MyWatchedVods from '../Component/MyWatchedVods'; // Ensure the path is correct
import YouTubeTrends from '../Component/YouTubeTrends'; // Ensure the path is correct
import PopularVods from '../Component/PopularVods'; // Ensure the path is correct
import SearchBasedVods from '../Component/SearchBasedVods'; // Ensure the path is correct
import RatingBasedVods from '../Component/RatingBasedVods'; // Ensure the path is correct
import Spotify from '../Component/Spotify'; // Ensure the path is correct
import '../CSS/Main.css'; // Ensure the path is correct
import axios from 'axios';

const mockVods = [
  {
    TITLE: "파묘", 
    VOD_ID: 1, 
    POSTER_URL: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/tw0i3kkmOTjDjGFZTLHKhoeXVvA.jpg"
  },
  {
    TITLE: "사바하", 
    VOD_ID: 2, 
    POSTER_URL: "https://an2-img.amz.wtchn.net/image/v2/l1a-plNEIARDrVlmfjXc_Q.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMMjVqTm1nNWJYbHViWGQxTlhwcE4yNDNhbkl3SW4wLjk0MnUxbzBLcU9QTzN4YnJocXh2YklTVVNHLTNLQ1BfRXIxRUI1T2htVVk"
  }, 
  {
    TITLE: "검은 사제들", 
    VOD_ID: 3, 
    POSTER_URL: "https://an2-img.amz.wtchn.net/image/v2/09NZnwnlQVggGexLePzVFw.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMM1J1ZDJkMk9HVnFjV3hxZEd4MWMyMXhlVzV1SW4wLnROR2N0ajJ1RHFOZWF1b0xza3ZsakFMY1lBXzBXekxFYVpwLV9EODNsSFU"
  }
];

const Main = () => {
  const [state, setState] = useState({
    myWatchedVods: mockVods,
    youtubeTrendsVods: mockVods,
    popularVods: mockVods,
    searchBasedVods: mockVods,
    ratingBasedVods: mockVods,
    spotifyVods: mockVods,
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

  const fetchVodData = useCallback(async (user_id) => {
    try {
      // 모킹된 데이터를 사용하여 상태를 업데이트합니다.
      setState(prevState => ({
        ...prevState,
        myWatchedVods: mockVods,
        youtubeTrendsVods: mockVods,
        popularVods: mockVods,
        searchBasedVods: mockVods,
        ratingBasedVods: mockVods,
        spotifyVods: mockVods
      }));
    } catch (error) {
      console.error('Error fetching VOD data:', error);
    }
  }, []);

  const checkAndFetchVods = useCallback(async (user_id) => {
    try {
      fetchVodData(user_id);
    } catch (error) {
      console.error('Error checking Spotify link status:', error);
    }
  }, [fetchVodData]);

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
  }, [checkAndFetchVods, fetchVodData]);

  const handlePosterClick = () => {
    navigate(`/movieDetailPage`);
  };

  const handleSearchResultClick = (vod_id) => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/movies/${vod_id}`);
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
        handlePosterClick={handlePosterClick}
        handleSearchIconClick={() => setSearchActive(true)}
        handleCloseIconClick={() => setSearchActive(false)}
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
