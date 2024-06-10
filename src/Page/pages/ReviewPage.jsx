import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../CSS/ReviewPage.css';

const ReviewPage = () => {
  const [reviewData, setReviewData] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_id = 'example_user_id'; // Replace with actual user ID

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/review/${user_id}`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserReviews();
  }, [user_id]);

  const handleEditStarClick = (rating) => {
    setEditReview({ ...editReview, RATING: rating });
  };

  const openModal = (review) => {
    setEditReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditReview(null);
    setIsModalOpen(false);
  };

  const updateReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.REACT_APP_EUD_ADDRESS}/review/${editReview.REVIEW_ID}`, editReview);
      if (response.data.response === "FINISH UPDATE REVIEW") {
        const updatedResponse = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/review/${user_id}`);
        setReviewData(updatedResponse.data);
        closeModal();
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_EUD_ADDRESS}/review/${reviewId}`);
      if (response.data.response === "FINISH DELETE REVIEW") {
        const updatedResponse = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/review/${user_id}`);
        setReviewData(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="reviews-container">
      <h3>내가 쓴 리뷰</h3>
      <ul>
        {reviewData.map((review) => (
          <li key={review.REVIEW_ID} className="review-item">
            <img src={review.POSTER} alt={review.TITLE} className="review-poster" />
            <div className="review-content">
              <p><strong>제목:</strong> {review.TITLE}</p>
              <p><strong>리뷰:</strong> {review.COMMENT}</p>
              <p><strong>별점:</strong> {Array(review.RATING).fill('★').join(' ')}</p>
              <p className="review-date">({review.REVIEW_WDATE})</p>
              <div className="review-actions">
                <button onClick={() => openModal(review)}>수정</button>
                <button onClick={() => deleteReview(review.REVIEW_ID)}>삭제</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
              <img src={editReview.POSTER} alt={editReview.TITLE} className="modal-review-poster" />
              <div className="modal-review-info">
                <label>리뷰: </label>
                <input
                  type="text"
                  name="COMMENT"
                  value={editReview.COMMENT}
                  onChange={(e) => setEditReview({ ...editReview, COMMENT: e.target.value })}
                />
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${editReview.RATING >= star ? 'filled' : ''}`}
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
