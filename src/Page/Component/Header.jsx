import React from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();  // 현재 URL 경로를 가져옴

  const goToMainPage = () => {
    navigate('/Main');
  };

  const getCategoryClass = (path) => {
    return location.pathname === path ? 'category active' : 'category';
  };

  return (
    <header className="header">
      <div className="logo-container" onClick={goToMainPage} role="button" aria-label="Go to Main Page">
        <img src={logo} alt="Hell:D Logo" className="logo" />
      </div>
      <nav className="category-container">
        <Link
          to="/Movie"
          className={getCategoryClass('/Movie')}
        >
          영화
        </Link>
        <Link
          to="/Series"
          className={getCategoryClass('/Series')}
        >
          시리즈
        </Link>
        <Link
          to="/Kids"
          className={getCategoryClass('/Kids')}
        >
          키즈
        </Link>
      </nav>
      <div className="icons-container">
        <div className="icon">
          <Search
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
        <div className="icon">
          <Like
            state={state}
            playlistVisible={playlistVisible}
            togglePlaylistVisibility={togglePlaylistVisibility}
            navigate={navigate}
          />
        </div>
        <div className="icon">
          <MyMenu
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
