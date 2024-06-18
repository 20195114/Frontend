import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/SearchBar.css';

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
  const navigate = useNavigate();
  const initialResults: SearchResult[] = JSON.parse(localStorage.getItem('searchResults') || '[]');
  const initialQuery: string = localStorage.getItem('searchQuery') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);

  const fetchHistory = useCallback(() => {
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

  const updateSearchHistory = useCallback((term: string) => {
    setSearchHistory((prevHistory) => {
      const newHistory = [...prevHistory, { keyword: term, date: new Date() }];
      if (newHistory.length > 6) {
        newHistory.shift();
      }
      localStorage.setItem('searchLog', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const sendSearchDataToBackend = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/search/${encodeURIComponent(searchTerm)}`);
      if (response.status === 200 && response.data.length > 0) {
        setSearchResults(response.data);
        setErrorMessage('');
        localStorage.setItem('searchResults', JSON.stringify(response.data));
        localStorage.setItem('searchQuery', searchTerm);
      } else {
        setErrorMessage('No VODs found for the search term.');
        setSearchResults([]);
        localStorage.removeItem('searchResults');
      }
      updateSearchHistory(searchTerm);
    } catch (error) {
      console.error('Error during search:', error);
      setErrorMessage('Please enter a valid search term.');
    }
    setIsLoading(false);
  }, [searchTerm, updateSearchHistory]);

  useEffect(() => {
    fetchHistory();
    if (searchTerm) {
      sendSearchDataToBackend();
    }
  }, [fetchHistory, searchTerm, sendSearchDataToBackend]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendSearchDataToBackend();
    }
  };

  const handleSearchResultClick = async (vod_id: string) => {
    const userId = localStorage.getItem('selectedUserId');
    if (!userId) {
      console.error('No user ID found in localStorage.');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/detailpage/vod_detail/${vod_id}/${userId}`);
      localStorage.setItem('vodDetail', JSON.stringify(response.data));
      navigate('/MovieDetailPage', { state: { vod_id: vod_id, user_id: userId } });
    } catch (error) {
      console.error('Error fetching VOD data:', error);
    }
  };

  const handleHistoryClick = (keyword: string) => {
    setSearchTerm(keyword);
    sendSearchDataToBackend();
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해 주세요"
        />
        <button onClick={sendSearchDataToBackend} disabled={isLoading}>
          검색
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <div className="search-history">
        <h3>검색 기록</h3>
        <ul>
          {searchHistory.map((entry, index) => (
            <li key={index} onClick={() => handleHistoryClick(entry.keyword)}>
              {entry.keyword} ({new Date(entry.date).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
      <div className="search-results">
        <ul>
          {searchResults.map((item) => (
            <li key={item.VOD_ID}>
              <img
                src={item.POSTER}
                alt={item.TITLE}
                onClick={() => handleSearchResultClick(item.VOD_ID)}
              />
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
