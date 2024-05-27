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
//         {reviewData.map(review => (
//           <li key={review.author}>
//             <p>{review.content}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Reviews;
