import React from 'react';
import { BsSkipStartBtn } from "react-icons/bs";
import '../CSS/Like.css'; // Ensure the path is correct
import axios from 'axios';

const Like = ({
  state,
  playlistVisible,
  togglePlaylistVisibility,
  navigate // navigate prop 추가
}) => {
  const handlePlaylistPosterClick = async (vod_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${vod_id}`);
      if (response.status === 200) {
        navigate(`/movieDetailPage`, { state: { movieDetail: response.data } });
      } else {
        console.error('Failed to fetch movie details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
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
          {state.myWatchedVods.slice(0, 3).map((vod, index) => (
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
