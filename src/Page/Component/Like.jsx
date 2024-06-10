import React, { useState, useEffect } from 'react';
import { BsSkipStartBtn } from 'react-icons/bs';
import '../CSS/Like.css'; // CSS 파일 경로 확인
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Like = ({ playlistVisible, togglePlaylistVisibility }) => {
  const [likedVods, setLikedVods] = useState([]);
  const navigate = useNavigate();
  const user_id = 'example_user_id'; // 실제 사용자 ID로 교체해야 합니다.

  // 백엔드로부터 찜 목록 데이터를 가져오는 함수
  useEffect(() => {
    const fetchLikedVods = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/like/${user_id}`);
        setLikedVods(response.data || []);
      } catch (error) {
        console.error('찜 목록을 가져오는 데 실패했습니다:', error);
      }
    };

    fetchLikedVods();
  }, [user_id]);

  // VOD 상세 페이지로 이동하는 함수
  const handlePlaylistPosterClick = async (vod_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${vod_id}`);
      if (response.status === 200) {
        navigate('/movieDetailPage', { state: { movieDetail: response.data } });
      } else {
        console.error('영화 정보를 가져오는 데 실패했습니다:', response.status);
      }
    } catch (error) {
      console.error('영화 정보를 가져오는 중 오류 발생:', error);
    }
  };

  return (
    <div className="playlist-container">
      <BsSkipStartBtn
        className="play-icon"
        onClick={togglePlaylistVisibility}
      />
      {playlistVisible && (
        <div className="playlist-box active">
          {likedVods.slice(0, 3).map((vod, index) => (
            <div key={index} className="playlist-item" onClick={() => handlePlaylistPosterClick(vod.VOD_ID)}>
              <img src={vod.POSTER || 'default-poster.jpg'} alt={vod.TITLE} />
              <p>{vod.TITLE}</p>
            </div>
          ))}
          <div className="more" onClick={() => navigate('/Playlist')}>
            더보기
          </div>
        </div>
      )}
    </div>
  );
};

export default Like;
