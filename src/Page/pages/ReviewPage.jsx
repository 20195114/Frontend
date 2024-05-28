// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ReviewPage = ({ movieId }) => {
//   const [reviewData, setReviewData] = useState([]);
//   const [newReview, setNewReview] = useState({ rating: '', comment: '' });

//   useEffect(() => {
//     const fetchReviewData = async () => {
//       try {
//         const response = await axios.get(`/api/movies/${movieId}/reviews`);
//         setReviewData(response.data);
//       } catch (error) {
//         console.error('Error fetching review data:', error);
//       }
//     };
//     fetchReviewData();
//   }, [movieId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewReview({ ...newReview, [name]: value });
//   };

//   const submitReview = async (e) => {
//     e.preventDefault();
//     try {
//       const user_id = 'example_user_id'; // 사용자의 ID를 실제로 넣어야 합니다
//       const title = 'example_title'; // 영화의 제목을 실제로 넣어야 합니다
//       const response = await axios.post(`/review/user_id=${user_id}/vod_id=${movieId}/title=${title}`, newReview);
//       if (response.data.response === "FINISH INSERT REVIEW") {
//         // 성공적으로 리뷰가 등록되면 리뷰 데이터를 다시 불러옵니다
//         const updatedResponse = await axios.get(`/api/movies/${movieId}/reviews`);
//         setReviewData(updatedResponse.data);
//         setNewReview({ rating: '', comment: '' }); // 폼을 초기화합니다
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//     }
//   };

//   return (
//     <div className="reviews-container">
//       <h3>리뷰</h3>
//       <ul>
//         {reviewData.map(review => (
//           <li key={review.author}>
//             <p>{review.content}</p>
//             <p>Rating: {review.rating}</p>
//           </li>
//         ))}
//       </ul>
//       <form onSubmit={submitReview}>
//         <div>
//           <label>Rating: </label>
//           <input
//             type="text"
//             name="rating"
//             value={newReview.rating}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div>
//           <label>Comment: </label>
//           <input
//             type="text"
//             name="comment"
//             value={newReview.comment}
//             onChange={handleInputChange}
//           />
//         </div>
//         <button type="submit">Submit Review</button>
//       </form>
//     </div>
//   );
// };

// export default ReviewPage;

import React, { useEffect, useState } from 'react';
import '../CSS/Review.css'; // 별점 스타일링을 위한 CSS 파일

const ReviewPage = ({ movieId }) => {
  const [reviewData, setReviewData] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    // 임의의 초기 리뷰 데이터
    const initialReviews = [
      { author: 'User1', content: 'Great movie!', rating: 5 },
      { author: 'User2', content: 'Not bad.', rating: 3 },
      { author: 'User3', content: 'Could be better.', rating: 2 },
    ];
    setReviewData(initialReviews);
  }, [movieId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const submitReview = (e) => {
    e.preventDefault();
    // 임의 사용자 데이터
    const user_id = 'test_user'; // 실제 사용자 ID를 사용할 때는 여기를 변경해야 합니다.

    const newReviewData = {
      author: user_id,
      content: newReview.comment,
      rating: newReview.rating,
    };

    // 새로운 리뷰 데이터를 기존 리뷰 데이터에 추가
    setReviewData([...reviewData, newReviewData]);
    setNewReview({ rating: 0, comment: '' }); // 폼을 초기화
  };

  return (
    <div className="reviews-container">
      <h3>리뷰</h3>
      <ul>
        {reviewData.map((review, index) => (
          <li key={index}>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
            <p>Author: {review.author}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={submitReview}>
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
    </div>
  );
};

export default ReviewPage;
