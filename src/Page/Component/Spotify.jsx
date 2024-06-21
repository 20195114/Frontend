import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/Main.css'; // CSS 파일 경로가 올바른지 확인하세요

const Spotify = ({ vods = [], handlePosterClick }) => {
  const displayVods = (vods) => {
    console.log(vods);
    return (
      <div className="vod-slider">
        {vods.map((vod) => (
          <div key={vod.VOD_ID} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
            <img src={vod.POSTER || '../URL/defaultPoster.png'} alt={vod.TITLE} />
            <p>{vod.TITLE}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="spotify-container">
      <h2>Spotify 감정 추천</h2>
      <div className="vod-container">
        {vods.length > 0 ? displayVods(vods) : <p>Loading...</p>}
      </div>
    </div>
  );
};

Spotify.propTypes = {
  vods: PropTypes.arrayOf(
    PropTypes.shape({
      VOD_ID: PropTypes.number.isRequired,
      POSTER: PropTypes.string,
      TITLE: PropTypes.string.isRequired,
    })
  ).isRequired,
  handlePosterClick: PropTypes.func.isRequired,
};

export default Spotify;
