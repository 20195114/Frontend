import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Review.css'; // CSS 파일 경로가 올바른지 확인하세요

const Reviews = ({ movieId }) => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/api/movies/${movieId}/reviews`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };
    fetchReviewData();
  }, [movieId]);

  return (
    <div className="reviews-container">
      <ul>
        {reviewData.map((review, index) => (
          <li key={index} className="review-item">
            <div className="review-header">
              <p className="review-author">{review.author}</p>
              <p className="review-rating">{review.rating}</p>
            </div>
            <p className="review-content">{review.content}</p>
            <p className="review-date">{review.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
