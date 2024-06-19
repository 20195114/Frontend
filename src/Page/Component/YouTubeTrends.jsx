import React from 'react';
import '../CSS/Main.css';

const YouTubeTrends = ({ vods, handlePosterClick }) => {
  const displayVods = (vods) => {
    return (
      <div className="vod-slider">
        {vods.map((vod, index) => (
          <div key={index} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
            <img src={vod.POSTER || '../URL/defaultPoster.png'} alt={vod.TITLE} />
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
        {vods.length > 0 ? displayVods(vods) : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default YouTubeTrends;
