import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchBar.css';
import axios from 'axios';


interface SearchLog {
  keyword: string;
  date: Date;
}

function SearchBar() {
  const location = useLocation();
  const initialResults = location.state?.searchResults || [];
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>(initialResults);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<SearchLog[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false); // showHistory 상태를 추가하여 검색 기록 표시 관리

  useEffect(() => {
    // 로컬 스토리지에서 검색 기록을 불러옵니다.
    const historyRaw = localStorage.getItem('searchLog');
    if (historyRaw) {
      try {
        const history = JSON.parse(historyRaw) as SearchLog[];
        setSearchHistory(history);
      } catch (error) {
        console.error('Error parsing searchLog', error);
        setSearchHistory([]);
      }
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const newHistory = [...searchHistory, { keyword: term, date: new Date() }];
    if (newHistory.length > 6) {
      newHistory.shift(); // 리스트가 6개 이상이면 가장 오래된 항목을 삭제
    }
    localStorage.setItem('searchLog', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('searchLog');
    setSearchHistory([]);
    setShowHistory(false); // 검색 기록을 삭제하면 기록 표시도 비활성화
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요"
        onFocus={() => setShowHistory(true)}
        onBlur={() => setShowHistory(false)}
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
                <p>{item.characters.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showHistory && searchHistory.length > 0 && (
        <div className="search-history">
          <ul>
            {searchHistory.map((log, index) => (
              <li key={index}>{log.keyword}</li>
            ))}
          </ul>
          <button onClick={clearSearchHistory}>검색목록 삭제하기</button>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
