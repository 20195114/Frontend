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

const Main = () => {
  const [state, setState] = useState({
    myWatchedVods: getCookieData('myWatchedVods', []),
    youtubeTrendsVods: getCookieData('youtubeTrendsVods', []),
    popularVods: getCookieData('popularVods', []),
    searchBasedVods: getCookieData('searchBasedVods', []),
    ratingBasedVods: getCookieData('ratingBasedVods', []),
    spotifyVods: getCookieData('spotifyVods', []),
    isSpotifyLinked: false,
    user_name: Cookies.get('selectedUserName') || 'User Name',
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

  // API 요청을 통해 데이터를 가져오는 함수
  const fetchData = useCallback(async (url, key, user_id = null) => {
    setLoading((prevState) => ({ ...prevState, [key]: true }));
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}${url}${user_id ? `/${user_id}` : ''}`);
      const data = response.data;

      if (key === 'spotifyVods') {
        if (data.status === false) {
          // 연동되지 않은 경우, 인증 URL을 받아옴
          const spotifyAuthResponse = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/mainpage/spotify/${user_id}`);
          const spotifyAuthUrl = spotifyAuthResponse.data.response;
          const newWindow = window.open(spotifyAuthUrl, '_blank', 'width=500,height=600');

          const interval = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(interval);
              // 인증 후 다시 Spotify VOD 목록 요청
              fetchData('/mainpage/home/spotify', 'spotifyVods', user_id);
            }
          }, 1000);
        } else {
          // 연동된 경우 VOD 데이터를 상태에 저장
          setState((prevState) => ({ ...prevState, [key]: data.vods, isSpotifyLinked: true }));
          Cookies.set(key, JSON.stringify(data.vods), { expires: 1 });
        }
      } else {
        setState((prevState) => ({ ...prevState, [key]: data }));
        Cookies.set(key, JSON.stringify(data), { expires: 1 });
      }
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    } finally {
      setLoading((prevState) => ({ ...prevState, [key]: false }));
    }
  }, []);

  // 사용자 데이터를 로드하는 함수
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
    const user_name = Cookies.get('selectedUserName');
    const user_id = Cookies.get('selectedUserId');
    const storedUsers = getCookieData('user_list', []);
    setUsers(storedUsers);

    if (user_id) {
      loadUserData(user_id);
    }
    if (user_name) {
      setState((prevState) => ({ ...prevState, user_name }));
    }
  }, [loadUserData]);

  // 포스터 클릭 시 처리하는 함수
  const handlePosterClick = (vod_id) => {
    const user_id = Cookies.get('selectedUserId');
    navigate(`/MovieDetailPage`, { state: { vod_id, user_id } });
  };

  // 검색 결과 클릭 시 처리하는 함수
  const handleSearchResultClick = (vod_id) => {
    setSearchActive(false);
    setSearchQuery('');
    setSearchResults([]);
    const user_id = Cookies.get('selectedUserId');
    navigate(`/MovieDetailPage`, { state: { vod_id, user_id } });
  };

  // 검색 제출 시 처리하는 함수
  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/search-vods`, { query: searchQuery });
        const user_id = Cookies.get('selectedUserId');
        navigate('/SearchBar', { state: { searchResults: response.data, user_id } });
      } catch (error) {
        console.error('Error searching VODs:', error);
      }
    }
  };

  // 플레이리스트 보이기/숨기기 토글
  const togglePlaylistVisibility = () => {
    setPlaylistVisible(!playlistVisible);
  };

  // 사용자 메뉴 보이기/숨기기 토글
  const toggleUserMenuVisibility = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  // 사용자 변경 처리 함수
  const handleUserChange = (user_id, user_name) => {
    Cookies.set('selectedUserId', user_id, { expires: 1 });
    Cookies.set('selectedUserName', user_name, { expires: 1 });
    setState((prevState) => ({ ...prevState, user_name }));
    setUserMenuVisible(false);
    loadUserData(user_id);
    navigate('/Main');
  };

  // 카테고리 클릭 처리 함수
  const handleCategoryClick = () => {
    navigate('/Movie', { state: { movies: state.myWatchedVods } });
  };

  // 메인 페이지로 이동 처리 함수
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
//