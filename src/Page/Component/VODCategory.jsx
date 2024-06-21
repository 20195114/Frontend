import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/VODCategory.css';

const VODCategory = ({ title, vods, handlePosterClick }) => {
  const defaultPoster = '../URL/defaultPoster.png'; // 기본 포스터 경로

  return (
    <div className="vod-category">
      <h2>{title}</h2>
      <div className="vod-slider">
        {vods.length ? (
          vods.map((vod) => (
            <div key={vod.VOD_ID} className="vod-item" onClick={() => handlePosterClick(vod.VOD_ID)}>
              <img src={vod.POSTER || defaultPoster} alt={vod.TITLE} />
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

VODCategory.propTypes = {
  title: PropTypes.string.isRequired,
  vods: PropTypes.arrayOf(
    PropTypes.shape({
      VOD_ID: PropTypes.number.isRequired,
      POSTER: PropTypes.string,
      TITLE: PropTypes.string.isRequired,
    })
  ).isRequired,
  handlePosterClick: PropTypes.func.isRequired,
};

export default VODCategory;
