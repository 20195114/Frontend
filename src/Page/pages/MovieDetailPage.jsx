import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import Header from '../Component/Header';
import { FaRegPlayCircle, FaRegHeart, FaHeart, FaRegStar } from 'react-icons/fa';
import Modal from 'react-modal';
import '../CSS/MovieDetailPage.css';

const MovieDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vod_id = location.state?.vod_id;
  const user_id = localStorage.getItem('user_id'); // localStorage에서 user_id 가져오기

  const [movie, setMovie] = useState(null);
  const [castData, setCastData] = useState([]);
  const [relatedMoviesData, setRelatedMoviesData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    if (!vod_id || !user_id) {
      setLoading(false);
      return;
    }

    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/detailpage/vod_detail/${vod_id}`);
        const movieData = response.data;

        if (movieData.MOVIE_ID) {
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
          setCastData(movieData.ACTOR || []);
          setReviewData(movieData.review || []);
        } else if (movieData.SERIES_ID) {
          setMovie({
            id: movieData.SERIES_ID,
            title: movieData.TITLE,
            genres: movieData.GENRE,
            summary: movieData.SERIES_OVERVIEW,
            posterURL: movieData.POSTER,
            trailerURL: movieData.TRAILER,
            releaseDate: movieData.RELEASE_DATE,
            duration: movieData.RTM,
            rating: movieData.SERIES_RATING,
          });
          setCastData((movieData.CAST || '').split(',').map(name => ({ ACTOR_NAME: name })));
          setReviewData(movieData.review || []);
        } else if (movieData.K_SERIES_ID) {
          setMovie({
            id: movieData.K_SERIES_ID,
            title: movieData.TITLE,
            genres: movieData.GENRE,
            summary: movieData.SERIES_OVERVIEW,
            posterURL: movieData.POSTER,
            trailerURL: movieData.TRAILER,
            releaseDate: movieData.RELEASE_DATE,
            duration: movieData.RTM,
            rating: movieData.SERIES_RATING,
          });
          setCastData((movieData.CAST || '').split(',').map(name => ({ ACTOR_NAME: name })));
          setReviewData(movieData.review || []);
        }

        const relatedResponse = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/detailpage/vod_detail/${vod_id}/related`);
        setRelatedMoviesData(Array.isArray(relatedResponse.data) ? relatedResponse.data : []);

        // 사용자 찜 상태 확인
        const playlistResponse = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/like/${user_id}`);
        const likedVods = playlistResponse.data;
        setIsInPlaylist(likedVods.some(vod => vod.VOD_ID === vod_id));

        // 리뷰 데이터 가져오기
        const reviewResponse = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/review/${user_id}`);
        const reviews = reviewResponse.data.filter(review => review.VOD_ID === vod_id);
        setReviewData(reviews);

        setLoading(false);
      } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [vod_id, user_id]);

  const togglePlaylist = async () => {
    try {
      if (isInPlaylist) {
        await axios.delete(`${process.env.REACT_APP_EC2_ADDRESS}/like/${user_id}`, { data: { VOD_ID: vod_id } });
        setIsInPlaylist(false);
      } else {
        await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/like/${user_id}`, { VOD_ID: vod_id });
        setIsInPlaylist(true);
      }
    } catch (error) {
      console.error('플레이리스트 상태를 업데이트하는 중 오류 발생:', error);
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleMovieClick = (movieId) => {
    navigate('/MovieDetailPage', { state: { vod_id: movieId } });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReviewSave = async () => {
    if (reviewText.trim() === '' || reviewRating === 0) {
      alert('리뷰와 별점을 입력해 주세요.');
      return;
    }

    const user_id = localStorage.getItem('user_id'); // localStorage에서 user_id 가져오기

    if (!user_id) {
      alert('로그인 정보가 없습니다. 로그인 후 다시 시도해 주세요.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/review/${user_id}`, {
        vod_id,
        rating: reviewRating,
        comment: reviewText,
      });
      setReviewData([...reviewData, { USER_NAME: '익명', COMMENT: reviewText, RATING: reviewRating, date: new Date().toLocaleDateString() }]);
      closeModal();
    } catch (error) {
      console.error('리뷰 저장 중 오류 발생:', error);
      alert('리뷰 저장에 실패했습니다.');
    }
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
              <FaRegPlayCircle className="play-button" onClick={openModal} />
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
                  <p>{actor.ACTOR_NAME}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="review-section">
            <h3>리뷰</h3>
            <ul className="review-list">
              {reviewData.map((review, index) => (
                <li key={index} className="review-item">
                  <p><strong>ID:</strong> {review.USER_NAME}</p>
                  <p><strong>리뷰:</strong> {review.COMMENT}</p>
                  <p><strong>별점:</strong> {Array(review.RATING).fill('★').join(' ')}</p>
                  <p className="review-date">({review.REVIEW_WDATE})</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="related-movies-section">
            <h3>추천 영화</h3>
            <ul className="related-movies-list">
              {relatedMoviesData.map((relatedMovie) => (
                <li key={relatedMovie.id} className="related-movie-item" onClick={() => handleMovieClick(relatedMovie.id)}>
                  <img src={relatedMovie.imageUrl} alt={relatedMovie.title} />
                  <p>{relatedMovie.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
        <div className="modal-content">
          <img src={movie.posterURL} alt={movie.title} className="modal-poster" />
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="리뷰를 남겨주세요."
            className="modal-textarea"
          />
          <div className="modal-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaRegStar
                key={star}
                className={`modal-star ${star <= reviewRating ? 'selected' : ''}`}
                onClick={() => setReviewRating(star)}
              />
            ))}
          </div>
          <div className="modal-buttons">
            <button onClick={closeModal} className="modal-button cancel">나중에</button>
            <button onClick={handleReviewSave} className="modal-button save">저장</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MovieDetailPage;
