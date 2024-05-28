// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Reviews = ({ movieId }) => {
//   const [reviewData, setReviewData] = useState([]);

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

//   return (
//     <div className="reviews-container">
//       <h3>리뷰</h3>
//       <ul>
//         {reviewData.map((review, index) => (
//           <li key={index}>
//             <p>{review.content}</p>
//             <p>Rating: {review.rating}</p>
//             <p>Author: {review.author}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Reviews;


import React, { useEffect, useState } from 'react';

const Reviews = ({ movieId }) => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    // 임의의 초기 리뷰 데이터
    const initialReviews = [
      { author: 'User1', content: 'Great movie!', rating: 5 },
      { author: 'User2', content: 'Not bad.', rating: 3 },
      { author: 'User3', content: 'Could be better.', rating: 2 },
    ];
    setReviewData(initialReviews);
  }, [movieId]);

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
    </div>
  );
};

export default Reviews;

//리뷰를 어떤형태로 정렬 및 배치할지 수정