import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import VODCategory from '../Component/VODCategory';
import '../CSS/Movie.css';
import Cookies from 'js-cookie';

const Series = () => {
  const [state, setState] = useState({
    actionFantasy: JSON.parse(Cookies.get('actionFantasy') || '[]'),
    familyComedy: JSON.parse(Cookies.get('familyComedy') || '[]'),
    drama: JSON.parse(Cookies.get('drama') || '[]'),
    reality: JSON.parse(Cookies.get('reality') || '[]'),
  });

  const [loading, setLoading] = useState({
    actionFantasy: false,
    familyComedy: false,
    drama: false,
    reality: false,
  });

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async (url, key) => {
    setLoading(prevState => ({ ...prevState, [key]: true }));
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${url}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setState(prevState => ({ ...prevState, [key]: data }));
      Cookies.set(key, JSON.stringify(data), { expires: 1 });
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      setState(prevState => ({ ...prevState, [key]: [] }));
    } finally {
      setLoading(prevState => ({ ...prevState, [key]: false }));
    }
  }, []);

  useEffect(() => {
    fetchData('/mainpage/series/action-fantasy', 'actionFantasy');
    fetchData('/mainpage/series/family_comedy', 'familyComedy');
    fetchData('/mainpage/series/drama', 'drama');
    fetchData('/mainpage/series/reality', 'reality');
  }, [fetchData]);

  const handlePosterClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/search-vods`, { query: searchQuery });
        const results = Array.isArray(response.data) ? response.data : [];
        setSearchResults(results);
        navigate('/SearchBar', { state: { searchResults: results } });
      } catch (error) {
        console.error('Error searching VODs:', error);
      }
    }
  };

  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  const handleCategoryClick = (e) => {
    const category = e.target.textContent;
    navigate(`/${category}`);
  };

  const goToMainPage = () => {
    navigate('/Main');
  };

  return (
    <div className='movie-page'>
      <Header 
        state={state} 
        setState={setState} 
        users={[]} 
        setUsers={() => {}} 
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchInputRef={searchInputRef}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchResultClick={handlePosterClick}
        toggleUserMenuVisibility={toggleUserMenuVisibility}
        userMenuVisible={userMenuVisible}
        togglePlaylistVisibility={togglePlaylistVisibility}
        playlistVisible={playlistVisible}
        handleCategoryClick={handleCategoryClick}
        goToMainPage={goToMainPage}
      />

      <div className='vod-container'>
        {loading.actionFantasy ? (
          <p>Loading 액션/판타지 VODs...</p>
        ) : (
          <VODCategory title="액션/판타지" vods={state.actionFantasy || []} handlePosterClick={handlePosterClick} />
        )}
        {loading.familyComedy ? (
          <p>Loading 가족/코미디 VODs...</p>
        ) : (
          <VODCategory title="가족/코미디" vods={state.familyComedy || []} handlePosterClick={handlePosterClick} />
        )}
        {loading.drama ? (
          <p>Loading 드라마 VODs...</p>
        ) : (
          <VODCategory title="드라마" vods={state.drama || []} handlePosterClick={handlePosterClick} />
        )}
        {loading.reality ? (
          <p>Loading 예능(리얼리티) VODs...</p>
        ) : (
          <VODCategory title="예능(리얼리티)" vods={state.reality || []} handlePosterClick={handlePosterClick} />
        )}
      </div>
    </div>
  );
};

export default Series;
