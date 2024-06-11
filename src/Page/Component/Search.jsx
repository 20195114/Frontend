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
        console.log('검색 결과:', response.data);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('검색 결과 가져오기 중 오류:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (event) => {
    const keyword = searchQuery.trim();
    if (event.key === 'Enter' && keyword !== '') {
      console.log('엔터 키 입력 감지, 검색어:', keyword);
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/search/${encodeURIComponent(keyword)}`);
        console.log('네비게이트 호출 전 검색 결과:', response.data);
        navigate('/SearchBar', { state: { searchResults: response.data || [], searchQuery: keyword } });
        console.log('네비게이트 호출 완료');
      } catch (error) {
        console.error('VOD 검색 중 오류:', error);
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
