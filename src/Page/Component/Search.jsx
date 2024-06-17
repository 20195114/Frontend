import React, { useRef, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Search.css';

const Search = ({
  isVisible,
  setIsVisible,
  closeOthers,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  handleSearchResultClick,
  searchInputRef
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleSearchInputChange = async (event) => {
    const keyword = event.target.value;
    setSearchQuery(keyword);

    if (keyword.length > 0) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/search/${encodeURIComponent(keyword)}`);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('검색 결과를 가져오는 중 오류 발생:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/search/${encodeURIComponent(searchQuery.trim())}`);
        navigate('/SearchBar', { state: { searchResults: response.data || [], searchQuery: searchQuery.trim() } });
      } catch (error) {
        console.error('VOD 검색 중 오류:', error);
      }
    }
  };

  const handleIconClick = () => {
    closeOthers();
    setIsVisible(true);
    containerRef.current.classList.add('search-active');
    searchInputRef.current.focus();
  };

  const handleCloseIconClick = useCallback(() => {
    setIsVisible(false);
    containerRef.current.classList.remove('search-active');
    setSearchQuery('');
    setSearchResults([]);
  }, [setIsVisible, setSearchQuery, setSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleCloseIconClick();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleCloseIconClick]);

  return (
    <div className="search-container" ref={containerRef}>
      <FaSearch className="search-icon" onClick={handleIconClick} />
      <input
        type="text"
        className="search-input"
        value={searchQuery}
        onChange={handleSearchInputChange}
        onKeyDown={handleSearchSubmit}
        ref={searchInputRef}
        placeholder="제목, 배우, 장르 검색"
      />
      <IoClose className="close-icon" onClick={handleCloseIconClick} />
      {isVisible && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.slice(0, 10).map((result, index) => (
            <p key={index} onClick={() => handleSearchResultClick(result.VOD_ID)}>
              {result.TITLE}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
