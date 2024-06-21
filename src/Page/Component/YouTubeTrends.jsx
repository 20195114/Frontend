import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/Main.css';

const YouTubeTrends = ({ vods, handlePosterClick }) => {
  const defaultPoster = '../URL/defaultPoster.png'; // 기본 포스터 경로

  const displayVods = (vods) => {
    return (
      <div className="vod-slider">
        {vods.map((vod) => (
          <div key={vod.VOD_ID} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
            <img src={vod.POSTER || defaultPoster} alt={vod.TITLE} />
            <p>{vod.TITLE}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="youtube-trends-container">
      <h2>최근 유튜브 트렌드</h2>
      <div className="vod-container">
        {vods.length > 0 ? displayVods(vods) : <p>트렌드 비디오를 불러오는 중입니다...</p>}
      </div>
    </div>
  );
};

YouTubeTrends.propTypes = {
  vods: PropTypes.arrayOf(
    PropTypes.shape({
      VOD_ID: PropTypes.number.isRequired,
      POSTER: PropTypes.string,
      TITLE: PropTypes.string.isRequired,
    })
  ).isRequired,
  handlePosterClick: PropTypes.func.isRequired,
};

export default YouTubeTrends;
