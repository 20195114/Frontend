import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { BsSkipStartBtn } from "react-icons/bs";
import { IoLogoOctocat } from "react-icons/io5";
import Search from './Search'; // Ensure the path is correct
import '../CSS/Main.css'; // Ensure the path is correct

const Header = ({
  state,
  searchActive,
  setSearchActive,
  searchResults,
  setSearchResults,
  searchQuery,
  setSearchQuery,
  users,
  handleSearchInputChange,
  handleSearchSubmit,
  handlePosterClick,
  handleSearchIconClick,
  handleCloseIconClick,
  handleSearchResultClick,
  togglePlaylistVisibility,
  playlistVisible,
  toggleUserMenuVisibility,
  userMenuVisible,
  handleUserChange,
  handleCategoryClick,
  goToMainPage,
  searchInputRef
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 10000); // 10초 뒤에 헤더를 숨김
  };

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setVisible(true);
    resetTimeout();
  };

  return (
    <header className={`header ${visible ? 'visible' : 'hidden'}`} onMouseEnter={handleMouseEnter}>
      <div className="logo-container">
        <h1 className="logo" onClick={goToMainPage}>Hell:D</h1>
        <div className="category-container">
          <Link to="/Movie" className="category" onClick={handleCategoryClick}>영화</Link>
          <Link to="/Series" className="category">시리즈</Link>
          <Link to="/Kids" className="category">키즈</Link>
        </div>
      </div>
      <div className="icons-container">
        <Search
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          handleSearchInputChange={handleSearchInputChange}
          handleSearchSubmit={handleSearchSubmit}
          handleSearchIconClick={handleSearchIconClick}
          handleCloseIconClick={handleCloseIconClick}
          handleSearchResultClick={handleSearchResultClick}
          searchInputRef={searchInputRef}
        />
        <div className="playlist-container icon-link">
          <BsSkipStartBtn
            className="play-icon"
            onClick={togglePlaylistVisibility}
          />
          {playlistVisible && (
            <div className="playlist-box active">
              {state.myWatchedVods.slice(0, 3).map((vod, index) => (
                <div key={index} className="playlist-item">
                  <img src={vod.POSTER_URL || 'default-poster.jpg'} alt={vod.TITLE} />
                  <p>{vod.TITLE}</p>
                </div>
              ))}
              <div className="more" onClick={() => navigate('/Playlist')}>
                더보기
              </div>
            </div>
          )}
        </div>
        <div className="user-container icon-link">
          <FaUser
            className="user-icon"
            onClick={toggleUserMenuVisibility}
          />
          {userMenuVisible && (
            <div className="user-menu active">
              {users.map(user => (
                <div key={user.user_id} className="user-menu-item" onClick={() => handleUserChange(user.user_id, user.user_name)}>
                  <IoLogoOctocat className="user-icon-small" />
                  <p>{user.user_name}</p>
                </div>
              ))}
              <div className="user-menu-item" onClick={() => navigate('/User')}>
                <p>마이페이지</p>
              </div>
              <div className="user-menu-item" onClick={() => navigate('/review')}>
                <p>내가 쓴 리뷰 및 별점</p>
              </div>
              <div className="user-menu-item" onClick={() => navigate('/LoginComponent')}>
                <p>로그아웃</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
