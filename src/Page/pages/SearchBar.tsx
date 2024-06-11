import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import '../CSS/SearchBar.css';
import axios from 'axios';

interface SearchResult {
  VOD_ID: string;
  TITLE: string;
  POSTER: string;
}

interface SearchHistoryEntry {
  keyword: string;
  date: Date;
}

function SearchBar() {
  const location = useLocation();
  const initialResults: SearchResult[] = location.state?.searchResults || [];
  const initialQuery: string = location.state?.searchQuery || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  // useCallback을 사용하여 sendSearchDataToBackend 함수 메모이제이션
  const sendSearchDataToBackend = useCallback(async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/search/${encodeURIComponent(searchTerm)}`);
      if (response.status === 200 && response.data.length > 0) {
        setSearchResults(response.data);
        setErrorMessage('');
        console.log('검색 결과:', response.data);
      } else {
        setErrorMessage('검색어에 맞는 VOD가 없습니다.');
        setSearchResults([]);
      }
      updateSearchHistory(searchTerm);
    } catch (error) {
      console.error('검색 중 문제 발생:', error);
      setErrorMessage('검색 중 문제가 발생했습니다.');
    }
    setIsLoading(false);
  }, [searchTerm]); // searchTerm을 종속성으로 추가

  // useEffect에서 sendSearchDataToBackend와 searchTerm을 종속성 배열에 추가
  useEffect(() => {
    const historyRaw = localStorage.getItem('searchLog');
    if (historyRaw) {
      try {
        const history: SearchHistoryEntry[] = JSON.parse(historyRaw);
        setSearchHistory(history);
      } catch (error) {
        console.error('searchLog 파싱 중 오류 발생', error);
        setSearchHistory([]);
      }
    }
    if (searchTerm) {
      sendSearchDataToBackend(); // searchTerm과 sendSearchDataToBackend에 의존
    }
  }, [searchTerm, sendSearchDataToBackend]); // 종속성 배열에 추가

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
            <li key={item.VOD_ID}>
              <img src={item.POSTER} alt={item.TITLE} />
              <div>
                <h3>{item.TITLE}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchBar;
