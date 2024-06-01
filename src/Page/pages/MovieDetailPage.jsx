import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Header from '../Component/Header';
import Reviews from '../Component/Reviews';
import '../CSS/MovieDetailPage.css';

Modal.setAppElement('#root');

const MovieDetailPage = () => {
  const location = useLocation();
  const vod_id = location.state?.vod_id;
  const [movie, setMovie] = useState(null);
  const [castData, setCastData] = useState([]);
  const [relatedMoviesData, setRelatedMoviesData] = useState([]);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            <p>관람등급: {movie.rating}</p>
            <p>{movie.summary}</p>
            <button onClick={togglePlaylist} className="playlist-button">
              {isInPlaylist ? '❤️' : '🤍'}
            </button>
            {movie.trailerURL && (
              <button onClick={openModal} className="trailer-button">
                예고편 보기
              </button>
            )}
          </div>
        </div>

        <div className="movie-sections">
          <div className="cast-section">
            <h3>출연진</h3>
            <ul className="cast-list">
              {castData.map((actor, index) => (
                <li key={index} className="cast-item">
                  <img src={actor.PROFILE} alt={actor.ACTOR_NAME} className="cast-img" />
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Trailer Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="close-button">Close</button>
        <div className="video-container">
          <iframe
            width="100%"
            height="100%"
            src={movie.trailerURL}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default MovieDetailPage;
