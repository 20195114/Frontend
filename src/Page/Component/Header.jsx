import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search'; 
import Like from './Like'; 
import MyMenu from './MyMenu'; 
import '../CSS/Header.css'; 

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

  return (
    <header className="header">
      <div className="logo-container">
        <h1 className="logo" onClick={goToMainPage}>Hell:D</h1>
      </div>
      <div className="category-container">
        <Link to="/Movie" className="category" onClick={handleCategoryClick}>영화</Link>
        <Link to="/Series" className="category" onClick={handleCategoryClick}>시리즈</Link>
        <Link to="/Kids" className="category" onClick={handleCategoryClick}>키즈</Link>
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
        <Like
          state={state}
          playlistVisible={playlistVisible}
          togglePlaylistVisibility={togglePlaylistVisibility}
          navigate={navigate}
        />
        <MyMenu
          users={users}
          userMenuVisible={userMenuVisible}
          toggleUserMenuVisibility={toggleUserMenuVisibility}
          handleUserChange={handleUserChange}
        />
      </div>
    </header>
  );
};

export default Header;
