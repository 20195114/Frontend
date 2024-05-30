import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../CSS/ReviewPage.css';

const ReviewPage = () => {
  const [reviewData, setReviewData] = useState([]);
  const [newReview, setNewReview] = useState({ movieId: '', rating: 0, comment: '' });
  const [editReview, setEditReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = 'example_user_id'; // 실제 사용자 ID를 사용하세요

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}/reviews`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserReviews();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleEditStarClick = (rating) => {
    setEditReview({ ...editReview, rating });
  };

  const openModal = (review) => {
    setEditReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditReview(null);
    setIsModalOpen(false);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/review/user_id=${userId}/vod_id=${newReview.movieId}`, newReview);
      if (response.data.response === "FINISH INSERT REVIEW") {
        const updatedResponse = await axios.get(`/api/user/${userId}/reviews`);
        setReviewData(updatedResponse.data);
        setNewReview({ movieId: '', rating: 0, comment: '' }); // 폼을 초기화합니다
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const updateReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/review/${editReview.id}`, editReview);
      if (response.data.response === "FINISH UPDATE REVIEW") {
        const updatedResponse = await axios.get(`/api/user/${userId}/reviews`);
        setReviewData(updatedResponse.data);
        closeModal();
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="reviews-container">
      <h3>내가 쓴 리뷰</h3>
      <ul>
        {reviewData.map((review, index) => (
          <li key={index} className="review-item">
            <img src={review.moviePoster} alt={review.movieTitle} className="review-poster" />
            <div className="review-content">
              <p><strong>제목:</strong> {review.movieTitle}</p>
              <p><strong>리뷰:</strong> {review.content}</p>
              <p><strong>별점:</strong> {Array(review.rating).fill('★').join(' ')}</p>
              <p className="review-date">({review.date})</p>
              <div className="review-actions">
                <button onClick={() => openModal(review)}>수정</button>
                <button>삭제</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={submitReview}>
        <div>
          <label>영화 ID: </label>
          <input
            type="text"
            name="movieId"
            value={newReview.movieId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Rating: </label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${newReview.rating >= star ? 'filled' : ''}`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div>
          <label>Comment: </label>
          <input
            type="text"
            name="comment"
            value={newReview.comment}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit Review</button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="리뷰 수정"
        className="review-modal"
        overlayClassName="review-modal-overlay"
      >
        <h2>리뷰 수정</h2>
        {editReview && (
          <form onSubmit={updateReview}>
            <div className="review-modal-content">
              <img src={editReview.moviePoster} alt={editReview.movieTitle} className="modal-review-poster" />
              <div className="modal-review-info">
                <label>리뷰: </label>
                <input
                  type="text"
                  name="content"
                  value={editReview.content}
                  onChange={(e) => setEditReview({ ...editReview, content: e.target.value })}
                />
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${editReview.rating >= star ? 'filled' : ''}`}
                      onClick={() => handleEditStarClick(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <button type="submit">저장</button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ReviewPage;
