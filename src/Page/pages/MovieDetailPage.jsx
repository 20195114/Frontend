import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Component/Header'; // Ensure the path is correct
import Reviews from '../Component/Reviews'; // 리뷰 컴포넌트 분리
import '../CSS/MovieDetailPage.css';

const vod_info = {
  title: "파묘",
  posterURL: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/tw0i3kkmOTjDjGFZTLHKhoeXVvA.jpg",
  genres: "오컬트, 공포",
  disp_rtm: "2:13",
  summary: "미국 LA, 거액의 의뢰를 받은 무당 화림과 봉길은 기이한 병이 대물림되는 집안의 장손을 만난다.,조상의 묫자리가 화근임을 알아챈 화림은 이장을 권하고, 돈 냄새를 맡은 최고의 풍수사 상덕과 장의사 영근이 합류한다. 절대 사람이 묻힐 수 없는 악지에 자리한 기이한 묘. 상덕은 불길한 기운을 느끼고 제안을 거절하지만, 화림의 설득으로 결국 파묘가 시작되고… 나와서는 안될 것이 나왔다.",
  trailer_url: "https://www.youtube.com/watch?v=rjW9E1BR_30"
};

const cast = [
  { name: '최민식', imageUrl: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/sd7gIA6nEkq6zumkDCfxSE0YSSV.jpg' },
  { name: '김고은', imageUrl: 'https://media.themoviedb.org/t/p/w138_and_h175_face/qjuCNIwVxXZ7B81jpuCSHkXBLPP.jpg' },
  { name: '유해진', imageUrl: 'https://media.themoviedb.org/t/p/w138_and_h175_face/y6L2EsmnbnCFxCgfHR2oeL7oQoo.jpg' },
  { name: '이도현', imageUrl: 'https://media.themoviedb.org/t/p/w138_and_h175_face/1iDRxID6mHf8rftDG0kLWzfXvQA.jpg'} 
];

const relatedMovies = [
  { id: 1, title: '사바하', imageUrl: 'https://an2-img.amz.wtchn.net/image/v2/l1a-plNEIARDrVlmfjXc_Q.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMMjVqTm1nNWJYbHViWGQxTlhwcE4yNDNhbkl3SW4wLjk0MnUxbzBLcU9QTzN4YnJocXh2YklTVVNHLTNLQ1BfRXIxRUI1T2htVVk' },
  { id: 2, title: '검은 사제들', imageUrl: 'https://an2-img.amz.wtchn.net/image/v2/09NZnwnlQVggGexLePzVFw.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMM1J1ZDJkMk9HVnFjV3hxZEd4MWMyMXhlVzV1SW4wLnROR2N0ajJ1RHFOZWF1b0xza3ZsakFMY1lBXzBXekxFYVpwLV9EODNsSFU' },
  { id: 3, title: '사자', imageUrl: 'https://an2-img.amz.wtchn.net/image/v2/THpg0a8jQpOYeXLH8JhdBQ.jpg?jwt=ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKdmNIUnpJanBiSW1SZk5Ea3dlRGN3TUhFNE1DSmRMQ0p3SWpvaUwzWXhMMlY0WWpObGFXZHBlRFZ0WkdoeGJXeGhkWE51SW4wLlVrR3dhOHF0WGw1bmtuNl9mYzhBMzlwMFdRSW9EdjNDOEQtVmhjWXA5bjQ' }, 
];

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [castData, setCastData] = useState([]);
  const [relatedMoviesData, setRelatedMoviesData] = useState([]);
  const [isInPlaylist, setIsInPlaylist] = useState(false);

  useEffect(() => {
    // 실제 API 호출을 대체하는 모킹된 데이터를 사용합니다.
    setMovie(vod_info);
    setCastData(cast);
    setRelatedMoviesData(relatedMovies);
    setIsInPlaylist(false); // 기본값으로 플레이리스트에 추가되지 않은 상태로 설정
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const togglePlaylist = async () => {
    try {
      if (isInPlaylist) {
        // API 호출 대신 상태만 변경
        setIsInPlaylist(false);
      } else {
        // API 호출 대신 상태만 변경
        setIsInPlaylist(true);
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  return (
    <div className="movie-detail-page">
      <Header />
      <div className="movie-detail-container">
        <header>
          <h1>{movie.title} 디테일페이지</h1>
        </header>

        <div className="movie-content">
          <img src={movie.posterURL} alt={movie.title} />
          <div className="movie-details">
            <h2>{movie.genres}</h2>
            <p>{movie.summary}</p>
            <div className="playTrailer-container">
              <video autoPlay loop muted>
                <source src="/DetailPageVideo.mp4" type="video/mp4" />
                예고편
              </video>
            </div>
            <button onClick={togglePlaylist}>
              {isInPlaylist ? 'Remove from Playlist' : 'Add to Playlist'}
            </button>
          </div>
        </div>

        <div className="cast-reviews-related">
          <div className="cast-container">
            <h3>출연진</h3>
            <ul>
              {castData.map(actor => (
                <li key={actor.name}>
                  <img src={actor.imageUrl} alt={actor.name} />
                  <p>{actor.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <Reviews movieId={movieId} />

          <div className="related-movies-container">
            <h3>추천 영화</h3>
            <ul>
              {relatedMoviesData.map(movie => (
                <li key={movie.id}>
                  <img src={movie.imageUrl} alt={movie.title} />
                  <p>{movie.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Header from '../Component/Header';
// import Reviews from '../Component/Reviews';
// import logAction from '../Component/logAction';
// import '../CSS/MovieDetailPage.css';

// const MovieDetailPage = () => {
//   const { movieId } = useParams();
//   const [movie, setMovie] = useState(null);
//   const [castData, setCastData] = useState([]);
//   const [relatedMoviesData, setRelatedMoviesData] = useState([]);
//   const [isInPlaylist, setIsInPlaylist] = useState(false);
//   const [loading, setLoading] = useState(true); // 로딩 상태 추가

//   useEffect(() => {
//     const fetchMovieData = async () => {
//       try {
//         const response = await axios.get(`/api/movies/${movieId}`);
//         setMovie(response.data);
//         const castResponse = await axios.get(`/api/movies/${movieId}/cast`);
//         setCastData(castResponse.data);
//         const relatedResponse = await axios.get(`/api/movies/${movieId}/related`);
//         setRelatedMoviesData(relatedResponse.data);
//         const playlistResponse = await axios.get(`/api/playlist/${movieId}`);
//         setIsInPlaylist(playlistResponse.data.isInPlaylist);
//         setLoading(false); // 로딩 완료
//       } catch (error) {
//         console.error('Error fetching movie data:', error);
//         setLoading(false); // 로딩 완료
//       }
//     };
//     fetchMovieData();
//   }, [movieId]);

//   const togglePlaylist = async () => {
//     try {
//       if (isInPlaylist) {
//         await axios.delete(`/api/playlist/${movieId}`);
//         setIsInPlaylist(false);
//       } else {
//         await axios.post(`/api/playlist`, { movieId });
//         setIsInPlaylist(true);
//       }
//     } catch (error) {
//       console.error('Error updating playlist:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!movie) {
//     return <div>Movie not found</div>;
//   }

//   return (
//     <div className="movie-detail-page">
//       <Header />
//       <div className="movie-detail-container">
//         <header>
//           <h1>{movie.title} 디테일페이지</h1>
//         </header>

//         <div className="movie-content">
//           <img src={movie.posterURL} alt={movie.title} />
//           <div className="movie-details">
//             <h2>{movie.genres}</h2>
//             <p>{movie.summary}</p>
//             <div className="playTrailer-container">
//               <video id="trailer" autoPlay loop muted>
//                 <source src={movie.trailer_url} type="video/mp4" />
//                 예고편
//               </video>
//             </div>
//             <button onClick={togglePlaylist}>
//               {isInPlaylist ? '플레이리스트 삭제' : '플레이리스트 추가'}
//             </button>
//           </div>
//         </div>

//         <div className="cast-reviews-related">
//           <div className="cast-container">
//             <h3>출연진</h3>
//             <ul>
//               {castData.map(actor => (
//                 <li key={actor.name}>
//                   <img src={actor.imageUrl} alt={actor.name} />
//                   <p>{actor.name}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <Reviews movieId={movieId} />

//           <div className="related-movies-container">
//             <h3>추천 영화</h3>
//             <ul>
//               {relatedMoviesData.map(movie => (
//                 <li key={movie.id}>
//                   <img src={movie.imageUrl} alt={movie.title} />
//                   <p>{movie.title}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default logAction(MovieDetailPage);




//통신과 더불어 수정하면 다시 post해야함
// api 명세서 확인해서 통신 부분 수정해야할듯
//예고편 부분은 url 상태로 넘어가니까 수정
// 찜 아이콘 으로 구동하도록 변경
// header 부분도 아이콘 변경 및 헤더 말고 다른헤더 만들어야할것 같음
//playbuttom 추가해서 vod play 데이터를 축적할 수 있도록 해야함
