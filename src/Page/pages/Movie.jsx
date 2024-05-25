import React, { useState } from 'react';
import '../CSS/Movie.css';
import Header from '../Component/Header'; // 경로 수정


const Movie = () => {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({ myWatchedVods: [] });

  return (
    <div className='body'>
      <Header state={state} setState={setState} users={users} setUsers={setUsers} />
    </div>
  );
};

export default Movie;