import React, { useRef } from 'react';
import { FaSearch } from 'react-icons/fa'; 
import { IoClose } from 'react-icons/io5'; 
import { useNavigate } from 'react-router-dom'; 
import '../CSS/Search.css'; // Ensure the path is correct

const Search = ({
  searchActive,
  setSearchActive,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  searchInputRef
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const mockSearchResults = {
    vod_list: [
      { vod_title: "Joint Security Area", vod_id: 3150 },
      { vod_title: "Memories of Murder", vod_id: 3376 },
      { vod_title: "Day Trip", vod_id: 5476 }
    ]
  };

  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        // 실제 axios 요청 대신 모킹된 데이터를 사용
        const response = { data: mockSearchResults };
        setSearchResults(response.data.vod_list.slice(0, 5)); // 검색 결과를 최대 5개까지 제한
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        // 실제 axios 요청 대신 모킹된 데이터를 사용
        const response = { data: mockSearchResults };
        navigate('/SearchBar', { state: { searchResults: response.data.vod_list } });
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
            <p key={index} onClick={() => navigate(`/MovieDetail/${result.vod_id}`)}>
              {result.vod_title}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
