import React, { useState } from 'react';
import Header from '../Component/Header'; // 경로 수정
import '../CSS/Movie.css';

const Kids = () => {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({ myWatchedVods: [] });

  return (
    <div className='body'>
      <Header state={state} setState={setState} users={users} setUsers={setUsers} />
      <div className="vod-container">
        <h2>My Watched Kids Shows</h2>
        <div className="kids-list">
          {state.myWatchedVods.map((vod, index) => (
            <div key={index} className="kids-item">
              <img src={vod.POSTER_URL || 'default-poster.jpg'} alt={vod.TITLE} />
              <h3>{vod.TITLE}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kids;
