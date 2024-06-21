import React from 'react';
import '../CSS/Main.css';

const MyWatchedVods = ({ vods, handlePosterClick, user_name }) => {
  const displayVods = (vodList) => {
    return (
      <div className="vod-slider">
        {vodList.map((vod, index) => (
          <div key={vod.VOD_ID} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
            <img src={vod.POSTER || '../URL/defaultPoster.png'} alt={vod.TITLE} />
            <p>{vod.TITLE}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-watched-vods-container">
      <h2>{user_name} 맞춤 추천</h2>
      <div className="vod-container">
        {vods.length > 0 ? displayVods(vods) : <p>현재 시청 기록이 없습니다. 새로운 VOD를 시청해 보세요!</p>}
      </div>
    </div>
  );
};

export default MyWatchedVods;
