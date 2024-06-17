import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Search from './Search';
import Like from './Like';
import MyMenu from './MyMenu';
import '../CSS/Header.css';
import logo from '../URL/logoHelloD.png';

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
  handleSearchResultClick,
  togglePlaylistVisibility,
  playlistVisible,
  toggleUserMenuVisibility,
  userMenuVisible,
  handleUserChange,
  searchInputRef
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLikeVisible, setIsLikeVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const searchRef = useRef(null);
  const likeRef = useRef(null);
  const menuRef = useRef(null);

  const goToMainPage = () => {
    navigate('/Main');
  };

  const getCategoryClass = (path) => {
    return location.pathname === path ? 'category active' : 'category';
  };

  // useCallback을 사용하여 closeOthers 함수를 정의
  const closeOthers = useCallback(() => {
    setIsSearchVisible(false);
    setIsLikeVisible(false);
    setIsMenuVisible(false);
  }, [setIsSearchVisible, setIsLikeVisible, setIsMenuVisible]);

  const handleClickOutside = useCallback((event) => {
    if (
      searchRef.current && !searchRef.current.contains(event.target) &&
      likeRef.current && !likeRef.current.contains(event.target) &&
      menuRef.current && !menuRef.current.contains(event.target)
    ) {
      closeOthers();
    }
  }, [closeOthers]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <header className="header">
      <div className="logo-container" onClick={goToMainPage} role="button" aria-label="Go to Main Page">
        <img src={logo} alt="Hell:D Logo" className="logo" />
      </div>
      <nav className="category-container">
        <Link to="/Movie" className={getCategoryClass('/Movie')}>
          영화
        </Link>
        <Link to="/Series" className={getCategoryClass('/Series')}>
          시리즈
        </Link>
        <Link to="/Kids" className={getCategoryClass('/Kids')}>
          키즈
        </Link>
      </nav>
      <div className="icons-container">
        <div className="icon" ref={searchRef}>
          <Search
            isVisible={isSearchVisible}
            setIsVisible={setIsSearchVisible}
            closeOthers={closeOthers}
            searchActive={searchActive}
            setSearchActive={setSearchActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            handleSearchInputChange={handleSearchInputChange}
            handleSearchSubmit={handleSearchSubmit}
            handleSearchResultClick={handleSearchResultClick}
            searchInputRef={searchInputRef}
          />
        </div>
        <div className="icon" ref={likeRef}>
          <Like
            isVisible={isLikeVisible}
            setIsVisible={setIsLikeVisible}
            closeOthers={closeOthers}
            state={state}
            playlistVisible={playlistVisible}
            togglePlaylistVisibility={togglePlaylistVisibility}
            navigate={navigate}
          />
        </div>
        <div className="icon" ref={menuRef}>
          <MyMenu
            isVisible={isMenuVisible}
            setIsVisible={setIsMenuVisible}
            closeOthers={closeOthers}
            users={users}
            userMenuVisible={userMenuVisible}
            toggleUserMenuVisibility={toggleUserMenuVisibility}
            handleUserChange={handleUserChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
