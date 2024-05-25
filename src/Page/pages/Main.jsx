import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Component/Header'; // Ensure the path is correct
import MyWatchedVods from '../Component/MyWatchedVods'; // Ensure the path is correct
import YouTubeTrends from '../Component/YouTubeTrends'; // Ensure the path is correct
import PopularVods from '../Component/PopularVods'; // Ensure the path is correct
import SearchBasedVods from '../Component/SearchBasedVods'; // Ensure the path is correct
import RatingBasedVods from '../Component/RatingBasedVods'; // Ensure the path is correct
import Spotify from '../Component/Spotify'; // Ensure the path is correct
import '../CSS/Main.css'; // Ensure the path is correct

const spotifyVods = [
  {
    "TITLE": "Burla al marito", 
    "VOD_ID": 5, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  },
  {
    "TITLE": "Fregoli al restaurant", 
    "VOD_ID": 6, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  }, 
  {
    "TITLE": "A Trip to the Moon", 
    "VOD_ID": 7, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/9o0v5LLFk51nyTBHZSre6OB37n2.jpg"
  },
  {
    "TITLE": "Burla al marito", 
    "VOD_ID": 5, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  },
  {
    "TITLE": "Fregoli al restaurant", 
    "VOD_ID": 6, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  }, 
  {
    "TITLE": "A Trip to the Moon", 
    "VOD_ID": 7, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/9o0v5LLFk51nyTBHZSre6OB37n2.jpg"
  },
  {
    "TITLE": "Burla al marito", 
    "VOD_ID": 5, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  },
  {
    "TITLE": "Fregoli al restaurant", 
    "VOD_ID": 6, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  }, 
  {
    "TITLE": "A Trip to the Moon", 
    "VOD_ID": 7, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/9o0v5LLFk51nyTBHZSre6OB37n2.jpg"
  },
  {
    "TITLE": "Burla al marito", 
    "VOD_ID": 5, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  },
  {
    "TITLE": "Fregoli al restaurant", 
    "VOD_ID": 6, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/zwWZJas0QTaOEWYQiV0hKGhMyEB.jpg"
  }, 
  {
    "TITLE": "A Trip to the Moon", 
    "VOD_ID": 7, 
    "POSTER_URL": "https://image.tmdb.org/t/p/original/9o0v5LLFk51nyTBHZSre6OB37n2.jpg"
  }
];

const Main = () => {
  const [state, setState] = useState({
    myWatchedVods: spotifyVods,
    youtubeTrendsVods: spotifyVods,
    popularVods: spotifyVods,
    searchBasedVods: spotifyVods,
    ratingBasedVods: spotifyVods,
    spotifyVods: spotifyVods,
    isSpotifyLinked: false,
    user_name: ''
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
      const [
        myWatchedVodsResponse,
        youtubeTrendsVodsResponse,
        popularVodsResponse,
        searchBasedVodsResponse,
        ratingBasedVodsResponse,
        spotifyVodsResponse
      ] = await Promise.all([
        axios.get(`/my-watched-vods?userId=${user_id}`),
        axios.get(`/youtube-trends-vods?userId=${user_id}`),
        axios.get(`/popular-vods?userId=${user_id}`),
        axios.get(`/search-based-vods?userId=${user_id}`),
        axios.get(`/rating-based-vods?userId=${user_id}`),
        axios.get(`mainpage/spotify/${user_id}`)
      ]);

      setState(prevState => ({
        ...prevState,
        myWatchedVods: myWatchedVodsResponse.data,
        youtubeTrendsVods: youtubeTrendsVodsResponse.data,
        popularVods: popularVodsResponse.data,
        searchBasedVods: searchBasedVodsResponse.data,
        ratingBasedVods: ratingBasedVodsResponse.data,
        spotifyVods: spotifyVodsResponse.data
      }));
    } catch (error) {
      console.error('Error fetching VOD data:', error);
    }
  }, []);

  const checkAndFetchVods = useCallback(async (user_id) => {
    try {
      const linkResponse = await axios.post(`/mainpage/spotify/${user_id}/userinfo`);
      if (linkResponse.data.status) {
        fetchVodData(user_id);
      } else {
        window.open(linkResponse.data.spotifyLink, '_blank');
      }
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

  const handlePosterClick = (vod_id) => {
    axios.post('/vod-detail', { vod_id })
      .then(response => {
        navigate(`/MovieDetailPage/${vod_id}`);
      })
      .catch(error => {
        console.error('Error posting VOD ID:', error);
      });
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
  

