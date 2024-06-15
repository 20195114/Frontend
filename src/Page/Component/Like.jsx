import React, { useState, useEffect } from 'react';
import { BsSkipStartBtn } from 'react-icons/bs';
import '../CSS/Like.css'; // Ensure this path is correct
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Like = ({ playlistVisible, togglePlaylistVisibility }) => {
  const [likedVods, setLikedVods] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("selectedUserId"); // Ensure this retrieves the correct user ID

  console.log("User ID:", userId); // Logging user ID to ensure it is retrieved correctly

  // Fetch liked VODs
  useEffect(() => {
    const fetchLikedVods = async () => {
      if (!userId) {
        console.error('사용자 ID를 찾을 수 없습니다.');
        return;
      }

      try {
        // Ensure the URL is correct and formatted properly
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/like/${userId}`);
        console.log('API Response:', response); // Log response for debugging
        setLikedVods(response.data || []);
      } catch (error) {
        // Log detailed error information
        console.error('찜 목록을 가져오는 데 실패했습니다:', error);
        if (error.response) {
          console.error('서버 응답:', error.response.data);
          alert(`찜 목록을 가져오는 중 문제가 발생했습니다: ${error.response.data.message || 'Unknown error'}`);
        }
      }
    };

    fetchLikedVods();
  }, [userId]);

  // Handle playlist poster click
  const handlePlaylistPosterClick = (vod_id) => {
    navigate(`/MovieDetailPage`, { state: { vod_id } });
  };
  return (
    <div className="playlist-container">
      <BsSkipStartBtn className="play-icon" onClick={togglePlaylistVisibility} />
      {playlistVisible && (
        <div className="playlist-box active">
          {likedVods.slice(0, 3).map((vod, index) => (
            <div key={index} className="playlist-item" onClick={() => handlePlaylistPosterClick(vod.VOD_ID)}>
              <img src={vod.POSTER || 'default-poster.jpg'} alt={vod.TITLE} />
              <p>{vod.TITLE}</p>
            </div>
          ))}
          <div className="more" div style={{fontSize: '15px'}} onClick={() => navigate('/Playlist')}>
            더보기 
          </div>
        </div>
      )}
    </div>
  );
};

export default Like;

