import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../CSS/SearchBar.css';
import axios from 'axios';

interface SearchHistoryEntry {
  keyword: string;
  date: Date;
}

function SearchBar() {
  const location = useLocation();
  const initialResults = location.state?.searchResults || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    const historyRaw = localStorage.getItem('searchLog');
    if (historyRaw) {
      try {
        const history: SearchHistoryEntry[] = JSON.parse(historyRaw);
        setSearchHistory(history);
      } catch (error) {
        console.error('Error parsing searchLog', error);
        setSearchHistory([]);
      }
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sendSearchDataToBackend = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    try {
      const response = await axios.post('https://your-backend-api.com/search', { keyword: searchTerm });
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
        setErrorMessage('');
      } else {
        setErrorMessage('검색어에 맞는 VOD가 없습니다.');
        setSearchResults([]);
      }
      updateSearchHistory(searchTerm);
    } catch (error) {
      console.error('Search error:', error);
      setErrorMessage('검색 중 문제가 발생했습니다.');
    }
    setIsLoading(false);
  };

  const updateSearchHistory = (term: string) => {
    const newHistory: SearchHistoryEntry[] = [...searchHistory, { keyword: term, date: new Date() }];
    if (newHistory.length > 6) {
      newHistory.shift(); // 리스트가 6개 이상이면 가장 오래된 항목을 삭제
    }
    localStorage.setItem('searchLog', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={sendSearchDataToBackend} disabled={isLoading}>
        검색
      </button>
      {isLoading && <p>검색 중...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <div className="search-results">
        <ul>
          {searchResults.map((item) => (
            <li key={item.id}>
              <img src={item.poster} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.characters ? item.characters.join(', ') : 'No characters available'}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchBar;

// api 변경
// 임의데이터 넣어서 어떻게 표시되는지 확인해 봐야함
// CSS 수정해야함
