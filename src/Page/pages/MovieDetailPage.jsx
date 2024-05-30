import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../Component/Header'; // Ensure the path is correct
import Reviews from '../Component/Reviews'; // 리뷰 컴포넌트 분리
import '../CSS/MovieDetailPage.css';

const MovieDetailPage = () => {
  const location = useLocation();
  const { vod_id } = location.state; // 전달된 vod_id를 받아옵니다
  const [movie, setMovie] = useState(null);
  const [castData, setCastData] = useState([]);
  const [relatedMoviesData, setRelatedMoviesData] = useState([]);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/detailpage/vod_detail/${vod_id}`);
        const movieData = response.data;

        setMovie({
          id: movieData.MOVIE_ID,
          title: movieData.TITLE,
          genres: movieData.GENRE,
          summary: movieData.MOVIE_OVERVIEW,
          posterURL: movieData.POSTER,
          trailerURL: movieData.TRAILER,
          releaseDate: movieData.RELEASE_DATE,
          duration: movieData.RTM,
          rating: movieData.MOVIE_RATING,
        });

        // Assume the cast is a string and needs to be split into an array
        setCastData(movieData.CAST.split(',').map(actor => ({ name: actor.trim() })));

        // Assume related movies data is retrieved by another endpoint if available
        const relatedResponse = await axios.get(`/api/movies/${vod_id}/related`);
        setRelatedMoviesData(relatedResponse.data);

        const playlistResponse = await axios.get(`/api/playlist/${vod_id}`);
        setIsInPlaylist(playlistResponse.data.isInPlaylist);

        setLoading(false); // 로딩 완료
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setLoading(false); // 로딩 완료
      }
    };

    fetchMovieData();
  }, [vod_id]);

  const togglePlaylist = async () => {
    try {
      if (isInPlaylist) {
        await axios.delete(`/api/playlist/${vod_id}`);
        setIsInPlaylist(false);
      } else {
        await axios.post(`/api/playlist`, { vod_id });
        setIsInPlaylist(true);
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="movie-detail-page">
      <Header />
      <div className="movie-detail-container">
        <div className="movie-header">
          <img src={movie.posterURL} alt={movie.title} className="movie-poster" />
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p>개봉일: {movie.releaseDate}</p>
            <p>장르: {movie.genres}</p>
            <p>런닝타임: {movie.duration}분</p>
            <p>관람등급: 만 {movie.rating}세 이상</p>
            <p>{movie.summary}</p>
            <button onClick={togglePlaylist}>
              {isInPlaylist ? '플레이리스트 삭제' : '플레이리스트 추가'}
            </button>
          </div>
        </div>

        <div className="movie-sections">
          <div className="cast-section">
            <h3>출연진</h3>
            <ul>
              {castData.map((actor, index) => (
                <li key={index}>
                  <p>{actor.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <Reviews movieId={vod_id} />

          <div className="related-movies-section">
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
