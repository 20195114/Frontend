// import React, { useState } from 'react';
// import Header from '../Component/Header'; // 경로 수정
// import '../CSS/Movie.css';

// const Kids = () => {
//   const [users, setUsers] = useState([]);
//   const [state, setState] = useState({ myWatchedVods: [] });

//   return (
//     <div className='body'>
//       <Header state={state} setState={setState} users={users} setUsers={setUsers} />
//       <div className="vod-container">
//         <h2>My Watched Kids Shows</h2>
//         <div className="kids-list">
//           {state.myWatchedVods.map((vod, index) => (
//             <div key={index} className="kids-item">
//               <img src={vod.POSTER_URL || 'default-poster.jpg'} alt={vod.TITLE} />
//               <h3>{vod.TITLE}</h3>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Kids;

import React, { useState, useEffect } from 'react';
import '../CSS/Movie.css';
import Header from '../Component/Header'; // 필요에 따라 경로를 조정하세요

const Kids = () => {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({ myWatchedVods: [] });
  const [vods, setVods] = useState([]);

  useEffect(() => {
    const fetchedVods = [
      { id: 1, poster: 'path_to_poster1.jpg', title: '파묘' },
      { id: 2, poster: 'path_to_poster2.jpg', title: '사바하' },
      { id: 3, poster: 'path_to_poster3.jpg', title: '검은 사제들' },
    ];
    setVods(fetchedVods);
  }, []);

  return (
    <div className='body'>
      <Header state={state} setState={setState} users={users} setUsers={setUsers} />
      <div className='vod-container'>
        <h2>추천 영화</h2>
        <div className='movie-list'>
          {vods.map((vod) => (
            <div key={vod.id} className='movie-item'>
              <img src={vod.poster} alt={vod.title} />
              <p>{vod.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kids;
