import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// import './MovieDetailPage.css';
// import StarRating /Starfrom '.Rating';
// import LikeButton from './LikeButton';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 영화 상세 정보 요청 (POST)
        const movieDetailsResponse = await axios.post(`/api/movies/details`, { id: movieId });
        setMovie(movieDetailsResponse.data);

        // 출연진 정보 요청 (POST)
        const castResponse = await axios.post(`/api/movies/cast`, { id: movieId });
        setCast(castResponse.data);

        // 리뷰 정보 요청 (POST)
        const reviewsResponse = await axios.post(`/api/movies/reviews`, { id: movieId });
        setReviews(reviewsResponse.data);

        // 관련 영화 정보 요청 (POST)
        const relatedMoviesResponse = await axios.post(`/api/movies/related`, { id: movieId });
        setRelatedMovies(relatedMoviesResponse.data);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchData();
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const playTrailer = () => {
    window.open(movie.trailer_url, 'trailerWindow', 'width=800, height=450');
  };

  return (
    <div className="movie-detail-container">
      <header>
        <h1>{movie.title} 디테일페이지</h1>
        {/* <LikeButton /> */}
      </header>

      <div className="movie-content">
        <img src={movie.posterURL} alt={movie.title} />
        <div>
          <h2>{movie.genres}</h2>
          <p>{movie.summary}</p>
          {/* <StarRating rating={movie.rating} /> */}
          <button onClick={playTrailer}>Watch Trailer</button>
        </div>
      </div>

      <h3>Cast</h3>
      <ul>
        {cast.map(actor => (
          <li key={actor.name}>
            <img src={actor.imageUrl} alt={actor.name} />
            <p>{actor.name}</p>
          </li>
        ))}
      </ul>

      <h3>Reviews</h3>
      {reviews.map(review => (
        <div key={review.author}>
          {/* <StarRating rating={review.rating} /> */}
          <p>{review.content}</p>
        </div>
      ))}

      <h3>Related Movies</h3>
      <div>
        {relatedMovies.map(movie => (
          <Link key={movie.title} to={`/movies/${movie.id}`}>
            <img src={movie.imageUrl} alt={movie.title} />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;
