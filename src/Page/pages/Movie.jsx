import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import VODCategory from '../Component/VODCategory';
import '../CSS/Movie.css';
import Cookies from 'js-cookie';

const Movie = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ myWatchedVods: JSON.parse(Cookies.get('myWatchedVods') || '[]') });
  const [vodsByCategory, setVodsByCategory] = useState({
    SF: JSON.parse(Cookies.get('SF') || '[]'),
    Education: JSON.parse(Cookies.get('Education') || '[]'),
    Family: JSON.parse(Cookies.get('Family') || '[]'),
    Horror: JSON.parse(Cookies.get('Horror') || '[]'),
    Drama: JSON.parse(Cookies.get('Drama') || '[]'),
    Romance: JSON.parse(Cookies.get('Romance') || '[]'),
    Action: JSON.parse(Cookies.get('Action') || '[]'),
    Animation: JSON.parse(Cookies.get('Animation') || '[]'),
  });
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);

  const fetchVods = useCallback(async (category, endpoint) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${endpoint}`);
      setVodsByCategory(prevState => ({
        ...prevState,
        [category]: response.data
      }));
      Cookies.set(category, JSON.stringify(response.data), { expires: 1 });
    } catch (error) {
      console.error(`Failed to fetch VODs for ${category}:`, error);
    }
  }, []);

  useEffect(() => {
    fetchVods('SF', '/mainpage/movie/SF-fantasy');
    fetchVods('Education', '/mainpage/movie/Liberal-Arts-Others');
    fetchVods('Family', '/mainpage/movie/family');
    fetchVods('Horror', '/mainpage/movie/horror');
    fetchVods('Drama', '/mainpage/movie/drama');
    fetchVods('Romance', '/mainpage/movie/romance');
    fetchVods('Action', '/mainpage/movie/action');
    fetchVods('Animation', '/mainpage/movie/animations');
  }, [fetchVods]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      navigate('/SearchBar', { state: { query: searchQuery } });
    }
  };

  const handleSearchResultClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
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
        handleSearchResultClick={handleSearchResultClick}
        toggleUserMenuVisibility={() => setUserMenuVisible(!userMenuVisible)}
        userMenuVisible={userMenuVisible}
        togglePlaylistVisibility={() => setPlaylistVisible(!playlistVisible)}
        playlistVisible={playlistVisible}
        handleCategoryClick={(e) => navigate(`/${e.target.textContent}`)}
        goToMainPage={goToMainPage}
      />

      <div className='vod-container'>
        <VODCategory title="SF/판타지" vods={vodsByCategory.SF || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="기타/교양" vods={vodsByCategory.Education || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="가족" vods={vodsByCategory.Family || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="공포" vods={vodsByCategory.Horror || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="드라마" vods={vodsByCategory.Drama || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="로맨스" vods={vodsByCategory.Romance || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="액션" vods={vodsByCategory.Action || []} handlePosterClick={handleSearchResultClick} />
        <VODCategory title="애니메이션" vods={vodsByCategory.Animation || []} handlePosterClick={handleSearchResultClick} />
      </div>
    </div>
  );
};

export default Movie;
