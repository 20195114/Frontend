import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import Header from '../Component/Header';
import Reviews from '../Component/Reviews';
import { FaRegPlayCircle, FaRegHeart, FaHeart } from 'react-icons/fa';
import '../CSS/MovieDetailPage.css';

const MovieDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vod_id = location.state?.vod_id;
  const [movie, setMovie] = useState(null);
  const [castData, setCastData] = useState([]);
  const [relatedMoviesData, setRelatedMoviesData] = useState([]);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vod_id) {
      setLoading(false);
      return;
    }

    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/detailpage/vod_detail/${vod_id}`);
        const movieData = response.data;

        setMovie({
          id: movieData.MOVIE_ID || movieData.SERIES_ID || movieData.K_SERIES_ID,
          title: movieData.TITLE,
          genres: movieData.GENRE,
          summary: movieData.MOVIE_OVERVIEW || movieData.SERIES_OVERVIEW,
          posterURL: movieData.POSTER,
          trailerURL: movieData.TRAILER,
          releaseDate: movieData.RELEASE_DATE,
          duration: movieData.RTM,
          rating: movieData.MOVIE_RATING || movieData.SERIES_RATING,
        });

        const cast = movieData.ACTOR || movieData.CAST.split(',').map(actor => ({ ACTOR_NAME: actor.trim() }));
        setCastData(cast);

        const relatedResponse = await axios.get(`/api/movies/${vod_id}/related`);
        setRelatedMoviesData(relatedResponse.data);

        const playlistResponse = await axios.get(`/api/playlist/${vod_id}`);
        setIsInPlaylist(playlistResponse.data.isInPlaylist);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setLoading(false);
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

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const videoId = getYouTubeId(movie.trailerURL);

  return (
    <div className="movie-detail-page">
      <Header goToMainPage={() => navigate('/Main')} />
      <div className="movie-detail-container">
        <div className="movie-header">
          <img src={movie.posterURL} alt={movie.title} className="movie-poster" />
          <div className="movie-info">
            <h1>
              {movie.title}
              <FaRegPlayCircle className="play-button" />
            </h1>
            <p>개봉일: {movie.releaseDate}</p>
            <p>장르: {movie.genres}</p>
            <p>런닝타임: {movie.duration}분</p>
            <p>관람등급: {movie.rating}</p>
            <p>{movie.summary}</p>
            <button onClick={togglePlaylist} className="playlist-button">
              {isInPlaylist ? <FaHeart className="heart-icon" /> : <FaRegHeart className="heart-icon" />}
            </button>
          </div>
        </div>

        <div className="movie-sections">
          <div className="trailer-section">
          <h3>예고편</h3>
            {videoId ? (
              <YouTube videoId={videoId} opts={{ width: '100%', height: '390px' }} />
            ) : (
              <p>예고편을 불러올 수 없습니다.</p>
            )}
          </div>

          <div className="cast-section">
            <h3>출연진</h3>
            <ul className="cast-list">
              {castData.map((actor, index) => (
                <li key={index} className="cast-item">
                  {actor.PROFILE && <img src={actor.PROFILE} alt={actor.ACTOR_NAME} className="cast-img" />}
                  <p>{actor.ACTOR_NAME || actor}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="review-section">
            <h3>리뷰</h3>
            <Reviews movieId={vod_id} />
          </div>

          <div className="related-movies-section">
            <h3>추천 영화</h3>
            <ul>
              {relatedMoviesData.map((movie) => (
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
