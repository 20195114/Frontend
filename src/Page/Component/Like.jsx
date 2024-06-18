import React, { useState, useEffect, useRef } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import '../CSS/Like.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Like = ({ isVisible, setIsVisible, closeOthers, state, playlistVisible, togglePlaylistVisibility }) => {
  const [likedVods, setLikedVods] = useState([]);
  const userId = localStorage.getItem("selectedUserId");
  const likeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedVods = async () => {
      if (!userId) {
        console.error('사용자 ID를 찾을 수 없습니다.');
        return;
      }

      if (!state.likeStatus) {
        console.log('찜 목록을 불러오지 않습니다.'); // likeStatus가 false일 때 동작 확인
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/like/${userId}`);
        setLikedVods(response.data || []);
      } catch (error) {
        console.error('찜 목록을 가져오는 데 실패했습니다:', error);
        if (error.response) {
          alert(`찜 목록을 가져오는 중 문제가 발생했습니다: ${error.response.data.message || 'Unknown error'}`);
        }
      }
    };

    fetchLikedVods();
  }, [userId, state.likeStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (likeRef.current && !likeRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsVisible]);

  const handleIconClick = () => {
    closeOthers();
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="playlist-container" ref={likeRef}>
      <FaRegHeart className="play-icon" onClick={handleIconClick} />
      {isVisible && state.likeStatus && (
        <div className="playlist-box active">
          {likedVods.slice(0, 3).map((vod, index) => (
            <div key={index} className="playlist-item" onClick={() => navigate(`/MovieDetailPage`, { state: { vod_id: vod.VOD_ID } })}>
              <img src={vod.POSTER || 'default-poster.jpg'} alt={vod.TITLE} />
              <p>{vod.TITLE}</p>
            </div>
          ))}
          <div className="more" style={{ fontSize: '15px' }} onClick={() => navigate('/Playlist')}>
            더보기 
          </div>
        </div>
      )}
    </div>
  );
};

export default Like;
