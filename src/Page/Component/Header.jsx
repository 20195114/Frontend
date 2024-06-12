import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  handleCategoryClick,
  searchInputRef
}) => {
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate('/Main');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img
          src={logo}
          alt="Hell:D Logo"
          className="logo"
          onClick={goToMainPage}
        />
      </div>
      <nav className="category-container">
        <Link to="/Movie" className="category" onClick={handleCategoryClick}>영화</Link>
        <Link to="/Series" className="category" onClick={handleCategoryClick}>시리즈</Link>
        <Link to="/Kids" className="category" onClick={handleCategoryClick}>키즈</Link>
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
