import React from 'react';
import '../CSS/Main.css'; // CSS 파일 경로가 올바른지 확인하세요

const RatingBasedVods = ({ vods, handlePosterClick }) => {
  const renderVods = () => {
    if (vods.length === 0) {
      return <p>Loading...</p>;
    }

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
    <div className="rating-based-vods-container">
      <h2>별점 기반 추천</h2>
      <div className="vod-container">
        {renderVods()}
      </div>
    </div>
  );
};

export default RatingBasedVods;
