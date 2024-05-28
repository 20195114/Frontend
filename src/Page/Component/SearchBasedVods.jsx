import React from 'react';
import '../CSS/Main.css'; // Ensure the path to your CSS file is correct

const SearchBasedVods = ({ vods, handlePosterClick }) => {
  const displayVods = (vods) => {
    return (
      <div className="vod-slider">
        {vods.map((vod, index) => (
          <div key={index} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
            <img src={vod.POSTER_URL || 'default-poster.jpg'} alt={vod.TITLE} />
            <p>{vod.TITLE}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-based-vods-container">
      <h2>검색 기반 추천</h2>
      <div className="vod-container">
        {vods.length > 0 ? displayVods(vods) : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default SearchBasedVods;
// logAction 코드로 검색어 추척도 가능할지 모름 안된다면,
// 검색어는 별개의 데이터로 운영해야함