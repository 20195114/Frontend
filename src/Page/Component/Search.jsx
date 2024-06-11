import React, { useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/Search.css';

const Search = ({
  searchActive,
  setSearchActive,
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
        setSearchResults(response.data || []);  // 결과를 받아와 상태를 업데이트
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]); // 에러 발생 시 결과를 초기화
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (event) => {
    const keyword = searchQuery.trim();
    if (event.key === 'Enter' && keyword !== '') {
      try {
        const response = await axios.get(`${process.env.REACT_APP_CUD_ADDRESS}/search/${encodeURIComponent(keyword)}`);
        navigate('/SearchBar', { state: { searchResults: response.data || [] } });  // 검색 결과 페이지로 이동
      } catch (error) {
        console.error('Error searching VODs:', error);
      }
    }
  };

  const handleSearchIconClick = () => {
    setSearchActive(true);
    containerRef.current.classList.add('search-active');
    searchInputRef.current.focus();
  };

  const handleCloseIconClick = () => {
    setSearchActive(false);
    containerRef.current.classList.remove('search-active');
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="search-container" ref={containerRef}>
      <FaSearch
        className="search-icon"
        onClick={handleSearchIconClick}
      />
      <input
        type="text"
        className="search-input"
        value={searchQuery}
        onChange={handleSearchInputChange}
        onKeyDown={handleSearchSubmit}
        ref={searchInputRef}
        placeholder="제목, 배우, 장르 검색"
      />
      <IoClose
        className="close-icon"
        onClick={handleCloseIconClick}
      />
      {searchActive && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result, index) => (
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
