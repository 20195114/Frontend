import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Component/Header'; // Ensure the path is correct
import '../CSS/MovieDetailPage.css';

const vod_info = {
  title: "파묘",
  posterURL: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/tw0i3kkmOTjDjGFZTLHKhoeXVvA.jpg",
  genres: "오컬트, 공포",
  disp_rtm: "2:13",
  summary: "미국 LA, 거액의 의뢰를 받은 무당 화림과 봉길은 기이한 병이 대물림되는 집안의 장손을 만난다.,조상의 묫자리가 화근임을 알아챈 화림은 이장을 권하고, 돈 냄새를 맡은 최고의 풍수사 상덕과 장의사 영근이 합류한다. 절대 사람이 묻힐 수 없는 악지에 자리한 기이한 묘. 상덕은 불길한 기운을 느끼고 제안을 거절하지만, 화림의 설득으로 결국 파묘가 시작되고… 나와서는 안될 것이 나왔다.",
  trailer_url: "/DetailPageVideo.mp4"
};

const cast = [
  { name: '최민식', imageUrl: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/sd7gIA6nEkq6zumkDCfxSE0YSSV.jpg' },
  { name: '김고은', imageUrl: 'https://media.themoviedb.org/t/p/w138_and_h175_face/qjuCNIwVxXZ7B81jpuCSHkXBLPP.jpg' },
  { name: '유해진', imageUrl: 'https://media.themoviedb.org/t/p/w138_and_h175_face/y6L2EsmnbnCFxCgfHR2oeL7oQoo.jpg' },
  { name: '이도현', imageUrl: 'https://media.themoviedb.org/t/p/w138_and_h175_face/1iDRxID6mHf8rftDG0kLWzfXvQA.jpg'} 
];

const reviews = [
  { author: 'Wang', content: '재밌었는데 마지막이 아쉽', rating: 4 },
  { author: '왕왕', content: '그냥 그래용', rating: 3 },
  { author: '크아용', content: '멍멍', rating: 2 },
  { author: '세숑이', content: '왈왈', rating: 1 },
  { author: '메롱이', content: '너무 좋아용', rating: 5 },
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
  const [reviewData, setReviewData] = useState([]);
  const [relatedMoviesData, setRelatedMoviesData] = useState([]);
  const [isInPlaylist, setIsInPlaylist] = useState(false);

  useEffect(() => {
    // 실제 API 호출을 대체하는 모킹된 데이터를 사용합니다.
    setMovie(vod_info);
    setCastData(cast);
    setReviewData(reviews);
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
    <div className="movie-detail-container">
      <Header 
        state={{}} // 필요한 props를 전달하세요.
        searchActive={false}
        setSearchActive={() => {}}
        searchResults={[]}
        setSearchResults={() => {}}
        searchQuery={''}
        setSearchQuery={() => {}}
        users={[]}
        handleSearchInputChange={() => {}}
        handleSearchSubmit={() => {}}
        handlePosterClick={() => {}}
        handleSearchIconClick={() => {}}
        handleCloseIconClick={() => {}}
        handleSearchResultClick={() => {}}
        togglePlaylistVisibility={() => {}}
        playlistVisible={false}
        toggleUserMenuVisibility={() => {}}
        userMenuVisible={false}
        handleUserChange={() => {}}
        handleCategoryClick={() => {}}
        goToMainPage={() => {}}
        searchInputRef={null}
      />
      
      <div className="movie-content">
        <img src={movie.posterURL} alt={movie.title} />
        <div className="movie-details">
          <h2>{movie.genres}</h2>
          <p>{movie.summary}</p>
          <button onClick={togglePlaylist}>
            {isInPlaylist ? '플레이리스트 삭제' : '플레이리스트 추가'}
          </button>
          <div className="playTrailer-container">
            <video autoPlay loop muted>
              <source src={movie.trailer_url} type="video/mp4" />
              예고편
            </video>
          </div>
        </div>
      </div>

      <div className="cast-reviews">
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
        <div className="reviews-container">
          <h3>리뷰</h3>
          <ul>
            {reviewData.map(review => (
              <li key={review.author}>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3>추천 영화</h3>
      <div className="related-movies-container">
        {relatedMoviesData.map(movie => (
          <Link key={movie.id} to={`/movieDetailPage/${movie.id}`}>
            <img src={movie.imageUrl} alt={movie.title} />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;
