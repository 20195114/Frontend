import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import Header from '../Component/Header';
import { FaRegPlayCircle, FaRegHeart, FaHeart, FaRegStar } from 'react-icons/fa';
import Modal from 'react-modal';
import '../CSS/MovieDetailPage.css';

Modal.setAppElement('#root');

const MovieDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vodId = location.state?.vod_id || sessionStorage.getItem('vodId');
  const userId = sessionStorage.getItem('selectedUserId');

  const [movie, setMovie] = useState(() => {
    const savedMovie = sessionStorage.getItem('movieDetail');
    return savedMovie ? JSON.parse(savedMovie) : null;
  });
  const [castData, setCastData] = useState(() => JSON.parse(sessionStorage.getItem('castData') || '[]'));
  const [recommendList, setRecommendList] = useState(() => JSON.parse(sessionStorage.getItem('recommendList') || '[]'));
  const [reviews, setReviews] = useState(() => JSON.parse(sessionStorage.getItem('reviews') || '[]'));
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const [seasonList, setSeasonList] = useState(() => JSON.parse(sessionStorage.getItem('seasonList') || '[]'));
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [selectedSeasonName, setSelectedSeasonName] = useState('');
  const [episodeList, setEpisodeList] = useState(() => JSON.parse(sessionStorage.getItem('episodeList') || '[]'));

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const likeRef = useRef(null);
  const menuRef = useRef(null);

  const baseAPI = process.env.REACT_APP_EC2_ADDRESS;

  const closeOthers = () => {
    setSearchActive(false);
    setPlaylistVisible(false);
    setUserMenuVisible(false);
  };

  const fetchEpisodeList = useCallback(async (seasonId, contentType) => {
    if (!seasonId || !contentType) return;

    try {
      setSelectedSeasonId(seasonId);

      const cleanSeasonId = seasonId;
      let endpoint;
      if (contentType === 'kids') {
        endpoint = `${baseAPI}/detailpage/kids_season_detail/kids_episode_detail/${cleanSeasonId}`;
      } else {
        endpoint = `${baseAPI}/detailpage/season_detail/episode_detail/${cleanSeasonId}`;
      }

      const response = await axios.get(endpoint);
      const episodeData = response.data;
      setEpisodeList(episodeData);
      sessionStorage.setItem('episodeList', JSON.stringify(episodeData));
    } catch (error) {
      console.error('에피소드 데이터를 가져오는 중 오류 발생:', error);
      alert('에피소드 데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [baseAPI]);

  const fetchSeasonList = useCallback(async (seriesId, contentType) => {
    if (!seriesId || !contentType) return;

    try {
      const cleanSeriesId = seriesId;
      let endpoint;
      if (contentType === 'kids') {
        endpoint = `${baseAPI}/detailpage/kids_season_detail/${cleanSeriesId}`;
      } else {
        endpoint = `${baseAPI}/detailpage/season_detail/${cleanSeriesId}`;
      }
      const response = await axios.get(endpoint);
      const seasonData = response.data;
      setSeasonList(seasonData);
      sessionStorage.setItem('seasonList', JSON.stringify(seasonData));

      if (seasonData.length > 0) {
        const { K_SEASON_ID, SEASON_ID, SEASON_NUM } = seasonData[0];
        const firstSeasonId = K_SEASON_ID || SEASON_ID;
        setSelectedSeasonName(`시즌 ${SEASON_NUM}`);
        setSelectedSeasonId(firstSeasonId);
        await fetchEpisodeList(firstSeasonId, contentType);
      }
    } catch (error) {
      console.error('시즌 데이터를 가져오는 중 오류 발생:', error);
      alert('시즌 데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [baseAPI, fetchEpisodeList]);

  const fetchMovieData = useCallback(async () => {
    if (!vodId) return;

    try {
      const response = await axios.get(`${baseAPI}/detailpage/vod_detail/${vodId}/${userId}`);
      const movieData = response.data;

      const movieDetails = {
        id: movieData.MOVIE_ID || movieData.SERIES_ID || movieData.K_SERIES_ID,
        title: movieData.TITLE,
        genres: movieData.GENRE,
        summary: movieData.MOVIE_OVERVIEW || movieData.SERIES_OVERVIEW,
        posterURL: movieData.POSTER,
        trailerURL: movieData.TRAILER,
        releaseDate: movieData.RELEASE_DATE,
        duration: movieData.RTM,
        rating: movieData.MOVIE_RATING || movieData.SERIES_RATING,
      };

      setMovie(movieDetails);
      sessionStorage.setItem('movieDetail', JSON.stringify(movieDetails));
      sessionStorage.setItem('vodId', vodId);

      const castDetails = movieData.ACTOR || (movieData.CAST || '').split(',').map(name => ({ ACTOR_NAME: name }));
      setCastData(castDetails);
      sessionStorage.setItem('castData', JSON.stringify(castDetails));

      setRecommendList(movieData.recommend_list || []);
      sessionStorage.setItem('recommendList', JSON.stringify(movieData.recommend_list || []));

      setIsInPlaylist(movieData.like_status);
      setReviews(movieData.review || []);
      sessionStorage.setItem('reviews', JSON.stringify(movieData.review || []));

      if (movieData.SERIES_ID || movieData.K_SERIES_ID) {
        const seriesId = movieData.SERIES_ID || movieData.K_SERIES_ID;
        const contentType = movieData.K_SERIES_ID ? 'kids' : 'series';
        await fetchSeasonList(seriesId, contentType);
      }
    } catch (error) {
      console.error('영화 데이터를 가져오는 중 오류 발생:', error);
      alert('영화 데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }, [vodId, userId, fetchSeasonList, baseAPI]);

  useEffect(() => {
    if (vodId) {
      fetchMovieData();
    }
  }, [vodId, fetchMovieData]);

  // 추가된 부분: vodId 변경 시 페이지 상단으로 스크롤
  useEffect(() => {
    if (vodId) {
      window.scrollTo(0, 0);
    }
  }, [vodId]);

  const togglePlaylist = async () => {
    try {
      const baseURL = process.env.REACT_APP_CUD_ADDRESS;
      const url = `${baseURL}/like/${userId}?VOD_ID=${vodId}`;
      console.log(isInPlaylist)
      if (isInPlaylist) {
        await axios.delete(url);
      } else {
        await axios.post(url);
      }

      setIsInPlaylist(!isInPlaylist);
      await fetchMovieData();
    } catch (error) {
      console.error('플레이리스트 상태를 업데이트하는 중 오류 발생:', error);
      alert('플레이리스트 상태를 업데이트하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|.*v=|.*\/)([\w-]{11}))/);
    return match ? match[1] : null;
  };

  const handleMovieClick = (movieId) => {
    navigate('/MovieDetailPage', { state: { vod_id: movieId } });
  };

  const closeReviewModal = () => setIsReviewModalOpen(false);

  const handleReviewSave = async () => {
    if (reviewText.trim() === '' || reviewRating === 0) {
      alert('리뷰와 별점을 입력해 주세요.');
      return;
    }

    try {
      const reviewPayload = {
        VOD_ID: vodId,
        RATING: reviewRating.toString(),
        COMMENT: reviewText,
      };

      const response = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/review/${userId}`, reviewPayload);
      if (response.status === 200 && response.data.response === "FINISH INSERT REVIEW") {
        const updatedResponse = await axios.get(`${baseAPI}/detailpage/vod_detail/${vodId}/${userId}`);
        setReviews(updatedResponse.data.review || []);
        sessionStorage.setItem('reviews', JSON.stringify(updatedResponse.data.review || []));
        closeReviewModal();
      } else {
        alert('리뷰 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 저장 중 오류 발생:', error);
      alert('리뷰 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventTimeLeft, setEventTimeLeft] = useState(10); // 이벤트 시간 10초로 설정
  const [isEventPlaying, setIsEventPlaying] = useState(false);
  const eventTimerRef = useRef(null);

  // POST 요청을 보내는 함수
  const sendPostRequest = useCallback(async () => {
    try {
      const url = `${process.env.REACT_APP_LOG_ADDRESS}/watch/${userId}?vod_id=${vodId}`;
      await axios.post(url, null, {
      });
    } catch (error) {
      console.error('POST 요청 중 오류 발생:', error);
      alert('POST 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [userId, vodId]);

  const openEventModal = () => {
    setIsEventModalOpen(true);
    setEventTimeLeft(10); // 시간 초기화
    setIsEventPlaying(false);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    clearTimeout(eventTimerRef.current);
  };

  const startEvent = () => {
    setIsEventPlaying(true);
    sendPostRequest(); // 재생 버튼 클릭 시 POST 요청 전송
    eventTimerRef.current = setTimeout(() => {
      closeEventModal();
      setIsReviewModalOpen(true); // 이벤트가 끝나면 리뷰 모달을 엽니다.
    }, eventTimeLeft * 1000); // 남은 시간을 밀리초로 변환
  };

  const pauseEvent = () => {
    setIsEventPlaying(false);
    clearTimeout(eventTimerRef.current);
  };

  // 이벤트 타이머 관리
  useEffect(() => {
    if (isEventPlaying) {
      const interval = setInterval(() => {
        setEventTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            closeEventModal();
            setIsReviewModalOpen(true); // 이벤트가 끝나면 리뷰 모달을 엽니다.
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isEventPlaying]);

  if (loading) return <div>로딩 중...</div>;
  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;

  const videoId = getYouTubeId(movie.trailerURL);

  return (
    <div className="movie-detail-page">
      <Header
        state={{}}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        users={[]}
        handleSearchInputChange={() => { }}
        handleSearchSubmit={() => { }}
        handleSearchResultClick={handleMovieClick}
        togglePlaylistVisibility={() => setPlaylistVisible(!playlistVisible)}
        playlistVisible={playlistVisible}
        toggleUserMenuVisibility={() => setUserMenuVisible(!userMenuVisible)}
        userMenuVisible={userMenuVisible}
        handleUserChange={() => { }}
        searchInputRef={searchInputRef}
        closeOthers={closeOthers}
        setIsSearchVisible={setSearchActive}
        setIsLikeVisible={setPlaylistVisible}
        setIsMenuVisible={setUserMenuVisible}
        searchRef={searchRef}
        likeRef={likeRef}
        menuRef={menuRef}
      />
      <div className="movie-detail-container">
        <div className="movie-header">
          <img src={movie.posterURL} alt={movie.title} className="movie-poster" loading="lazy" />
          <div className="movie-info">
            <h1>{movie.title}
              <FaRegPlayCircle className="play-button" onClick={openEventModal} />
            </h1>
            <p>개봉일: {movie.releaseDate}</p>
            <p>장르: {movie.genres}</p>
            <p>러닝타임: {movie.duration}분</p>
            <p>관람등급: {movie.rating}</p>
            <p>{movie.summary}</p>
            <button onClick={togglePlaylist} className="playlist-button">
              {isInPlaylist ? <FaHeart className="heart-icon" /> : <FaRegHeart className="heart-icon" />}
            </button>
          </div>
        </div>

        <div className="movie-sections">
          <TrailerSection videoId={videoId} />
          <CastSection castData={castData} />
          <ReviewSection reviews={reviews} />
          <RelatedMoviesSection recommendList={recommendList} onMovieClick={handleMovieClick} />
          {seasonList.length > 0 && <SeasonContainer seasonList={seasonList} selectedSeasonId={selectedSeasonId} selectedSeasonName={selectedSeasonName} setSelectedSeasonName={setSelectedSeasonName} onSeasonClick={fetchEpisodeList} episodeList={episodeList} />}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        movie={movie}
        reviewText={reviewText}
        setReviewText={setReviewText}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        onSave={handleReviewSave}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        onPlay={startEvent}
        onPause={pauseEvent}
        timeLeft={eventTimeLeft}
        isPlaying={isEventPlaying}
      />
    </div>
  );
};

const EventModal = ({ isOpen, onClose, onPlay, onPause, timeLeft, isPlaying }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="modal-overlay">
    <div className="modal-content">
      <p>이벤트 화면입니다. {timeLeft}초 남았습니다.</p>
      <div className="modal-buttons">
        {isPlaying ? (
          <button onClick={onPause} className="modal-button pause">정지</button>
        ) : (
          <button onClick={onPlay} className="modal-button play">재생</button>
        )}
        <button onClick={onClose} className="modal-button close">닫기</button>
      </div>
    </div>
  </Modal>
);

const TrailerSection = ({ videoId }) => (
  <div className="trailer-section">
    <h3>예고편</h3>
    {videoId ? (
      <YouTube videoId={videoId} opts={{ width: '100%', height: '390px' }} />
    ) : (
      <p>예고편을 불러올 수 없습니다.</p>
    )}
  </div>
);

const CastSection = ({ castData }) => (
  <div className="cast-section">
    <h3>출연진</h3>
    <ul className="cast-list">
      {castData.map((actor, index) => (
        <li key={index} className="cast-item">
          {actor.PROFILE && <img src={actor.PROFILE} alt={actor.ACTOR_NAME} className="cast-img" loading="lazy" />}
          <p>{actor.ACTOR_NAME}</p>
        </li>
      ))}
    </ul>
  </div>
);

const ReviewSection = ({ reviews }) => (
  <div className="review-section">
    <h3>리뷰</h3>
    <ul className="review-list">
      {reviews.map((review, index) => (
        <li key={index} className="review-item">
          <p><strong>이름:</strong>{review.USER_NAME}</p>
          <p><strong>&nbsp;&nbsp;&nbsp;리뷰:</strong>{review.COMMENT}</p>
          <p><strong>&nbsp;&nbsp;&nbsp;별점:</strong>{Array(review.RATING).fill('★').join(' ')}</p>
        </li>
      ))}
    </ul>
  </div>
);

const RelatedMoviesSection = ({ recommendList, onMovieClick }) => (
  <div className="related-movies-section">
    <h3>추천 영화</h3>
    <ul className="related-movies-list">
      {recommendList.slice(0, 8).map((relatedMovie, index) => (
        <li 
          key={index} 
          className="related-movie-item" 
          onClick={() => onMovieClick(relatedMovie.VOD_ID)}
        >
          <img src={relatedMovie.POSTER} alt={relatedMovie.TITLE} loading="lazy" />
          <p>{relatedMovie.TITLE}</p>
        </li>
      ))}
    </ul>
  </div>
);

const SeasonContainer = ({ seasonList, selectedSeasonId, selectedSeasonName, setSelectedSeasonName, onSeasonClick, episodeList }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSeasonSelect = async (seasonId, seasonNum) => {
    if (!seasonId) return;

    setIsDropdownOpen(false);
    setSelectedSeasonName(`시즌 ${seasonNum}`);{
      
      const contentType = seasonList.some(season => season.K_SEASON_ID) ? 'kids' : 'series';
      await onSeasonClick(seasonId, contentType);
    }
  };

  return (
    <div className="season-container">
      <h3>시즌</h3>
      <div className="season-dropdown">
        <button className="season-dropdown-button" onClick={handleDropdownToggle}>
          {selectedSeasonName || (seasonList.length > 0 ? `시즌 ${seasonList[0].SEASON_NUM}` : '시즌 선택')} <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
        </button>
        {isDropdownOpen && (
          <ul className="season-list">
            {seasonList.map((season) => (
              <li
                key={season.K_SEASON_ID || season.SEASON_ID}
                className={`season-item ${season.K_SEASON_ID === selectedSeasonId || season.SEASON_ID === selectedSeasonId ? 'selected' : ''}`}
                onClick={() => handleSeasonSelect(season.K_SEASON_ID || season.SEASON_ID, season.SEASON_NUM)}
              >
                {`시즌 ${season.SEASON_NUM} (${season.EPISODE_COUNT || 0} 개의 에피소드)`}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedSeasonId && episodeList.length > 0 ? (
        <div className="episode-container">
          <h4>에피소드</h4>
          <ul className="episode-list">
            {episodeList.map((episode) => (
              <li key={episode.EPISODE_ID || episode.K_EPISODE_ID} className="episode-item">
                <img src={episode.EPISODE_STILL || '../URL/defaultPoster.png'} alt={episode.EPISODE_NAME} className="episode-thumbnail" loading="lazy" />
                <div className="episode-info">
                  <h5>{episode.EPISODE_NAME || '제목이 없습니다.'}</h5>
                  <p>{episode.EPISODE_OVERVIEW || '설명이 없습니다.'}</p>
                  <p>방영일: {episode.EPISODE_AIR_DATE || episode.AIR_DATE || '미정'}</p>
                  <p>러닝타임: {episode.EPISODE_RTM ? `${episode.EPISODE_RTM}분` : '미정'}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>선택된 시즌에 에피소드가 없습니다.</p>
      )}
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, movie, reviewText, setReviewText, reviewRating, setReviewRating, onSave }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="modal-overlay">
    <div className="modal-content-horizontal">
      <div className="top-container">
        <img src={movie.posterURL} alt={movie.title} className="modal-poster" loading="lazy" />
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="리뷰를 작성해 주세요..."
          className="modal-textarea"
        />
      </div>
      <div className="bottom-container">
        <div className="modal-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaRegStar
              key={star}
              className={`modal-star ${star <= reviewRating ? 'selected' : ''}`}
              onClick={() => setReviewRating(star)}
            />
          ))}
        </div>
        <div className="buttons-container">
          <button onClick={onClose} className="modal-button cancel">나중에</button>
          <button onClick={onSave} className="modal-button save">저장</button>
        </div>
      </div>
    </div>
  </Modal>
);

export default MovieDetailPage;
