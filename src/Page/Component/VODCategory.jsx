import React from 'react';
import '../CSS/VODCategory.css';

const VODCategory = ({ title, vods, handlePosterClick }) => {
  return (
    <div className="vod-category">
      <h2>{title}</h2>
      <div className="vod-slider">
        {vods.length > 0 ? (
          vods.map((vod) => (
            <div key={vod.VOD_ID} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
              <img src={vod.POSTER || '../URL/defaultPoster.png'} alt={vod.TITLE} />
              <p>{vod.TITLE}</p>
            </div>
          ))
        ) : (
          <p>해당 카테고리에 VOD가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default VODCategory;
