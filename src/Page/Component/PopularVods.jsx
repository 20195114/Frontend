import React from 'react';
import '../CSS/Main.css'; // CSS 파일 경로를 확인하세요

const PopularVods = ({ vods, handlePosterClick }) => {
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
    <div className="popular-vods-container">
      <h2>인기 컨텐츠</h2>
      <div className="vod-container">
        {renderVods()}
      </div>
    </div>
  );
};

export default PopularVods;
