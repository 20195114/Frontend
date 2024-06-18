import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header';
import VODCategory from '../Component/VODCategory';
import '../CSS/Movie.css';
import Cookies from 'js-cookie';

// 쿠키에서 데이터를 가져오고 기본 값을 설정하는 함수
const getCookieData = (key, defaultValue) => {
  const value = Cookies.get(key);
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing cookie data for ${key}:`, error);
    return defaultValue;
  }
};

// 쿠키에 데이터를 설정하는 함수
const setCookieData = (key, data) => {
  try {
    Cookies.set(key, JSON.stringify(data), { expires: 1 });
  } catch (error) {
    console.error(`Error setting cookie data for ${key}:`, error);
  }
};

const Movie = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    myWatchedVods: getCookieData('myWatchedVods', [])
  });

  const [vodsByCategory, setVodsByCategory] = useState({
    SF: getCookieData('SF', []),
    Education: getCookieData('Education', []),
    Family: getCookieData('Family', []),
    Horror: getCookieData('Horror', []),
    Drama: getCookieData('Drama', []),
    Romance: getCookieData('Romance', []),
    Action: getCookieData('Action', []),
    Animation: getCookieData('Animation', [])
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
      const vods = response.data || [];
      setVodsByCategory(prevState => ({
        ...prevState,
        [category]: vods
      }));
      setCookieData(category, vods);
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
