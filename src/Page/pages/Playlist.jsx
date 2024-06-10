import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../CSS/Playlist.css';
import Header from '../Component/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Playlist = () => {
  const navigate = useNavigate();
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const user_id = 'example_user_id'; // Replace with actual user ID

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/like/${user_id}`);
      setVods(response.data || []);
    } catch (error) {
      console.error('Failed to fetch VODs:', error);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      navigate('/SearchBar', { state: { query: searchQuery } });
    }
  };

  const handlePosterClick = (vod_id) => {
    navigate(`/MovieDetail/${vod_id}`);
  };

  const removeVod = async (vodId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_EUD_ADDRESS}/like/${user_id}`, { VOD_ID: vodId });
      if (response.data.response === "FINISH DELETE LIKE") {
        setVods(vods.filter(vod => vod.VOD_ID !== vodId));
      }
    } catch (error) {
      console.error('Error deleting VOD:', error);
    }
  };

  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  return (
    <div className='playlist-page'>
      <Header 
        state={{}}
        setState={() => {}}
        users={[]}
        setUsers={() => {}}
        searchActive={false}
        setSearchActive={() => {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={[]}
        setSearchResults={() => {}}
        searchInputRef={searchInputRef}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchResultClick={handlePosterClick}
        toggleUserMenuVisibility={toggleUserMenuVisibility}
        userMenuVisible={userMenuVisible}
        togglePlaylistVisibility={togglePlaylistVisibility}
        playlistVisible={playlistVisible}
        handleCategoryClick={() => {}}
        goToMainPage={() => navigate('/Main')}
      />

      <div className='vod-container'>
        <h2>찜 목록</h2>
        <div className='movie-list'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            vods.map((vod) => (
              <div key={vod.VOD_ID} className='movie-item'>
                <img src={vod.POSTER || 'default-poster.jpg'} alt={vod.TITLE} onClick={() => handlePosterClick(vod.VOD_ID)} />
                <p>{vod.TITLE}</p>
                {isEditing && <button className="delete-button" onClick={() => removeVod(vod.VOD_ID)}>X</button>}
              </div>
            ))
          )}
        </div>
        <button className='edit-button' onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? '저장' : '편집'}
        </button>
      </div>
    </div>
  );
};

export default Playlist;
