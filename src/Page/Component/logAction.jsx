// import React, { useEffect } from 'react';
// import axios from 'axios';

// const logAction = (WrappedComponent) => {
//   return (props) => {
//     useEffect(() => {
//       const userId = 'user123'; // 실제 사용자 ID로 대체
//       const sessionId = 'session456'; // 실제 세션 ID로 대체

//       const handleUserActivity = (action, additionalData = {}) => {
//         const logData = {
//           timestamp: new Date().toISOString(),
//           action: action,
//           userId: userId,
//           sessionId: sessionId,
//           ...additionalData,
//         };

//         // 서버로 로그 데이터 전송
//         axios.post('/api/logs', logData)
//           .then(response => {
//             console.log('Log data sent successfully:', response.data);
//           })
//           .catch(error => {
//             console.error('Error sending log data:', error);
//           });
//       };

//       // 클릭 이벤트 추적
//       const handleClick = (event) => {
//         handleUserActivity('click', {
//           element: event.target.tagName,
//           id: event.target.id,
//           className: event.target.className,
//         });
//       };

//       // 페이지 머무는 시간 추적
//       const handleBeforeUnload = () => handleUserActivity('page_unload');

//       // 비디오 재생 이벤트 추적
//       const handleVideoPlay = (event) => {
//         handleUserActivity('video_play', {
//           videoId: event.target.id,
//           currentTime: event.target.currentTime,
//         });
//       };

//       // 비디오 일시 정지 이벤트 추적
//       const handleVideoPause = (event) => {
//         handleUserActivity('video_pause', {
//           videoId: event.target.id,
//           currentTime: event.target.currentTime,
//         });
//       };

//       // 플레이리스트 추가/삭제 이벤트 추적
//       const handlePlaylistToggle = (event) => {
//         handleUserActivity('playlist_toggle', {
//           vodId: event.target.dataset.vodId,
//           action: event.target.dataset.action,
//         });
//       };

//       // 이벤트 리스너 등록
//       window.addEventListener('click', handleClick);
//       window.addEventListener('beforeunload', handleBeforeUnload);

//       // 비디오 태그를 찾아 이벤트 리스너 등록
//       const videos = document.querySelectorAll('video');
//       videos.forEach(video => {
//         video.addEventListener('play', handleVideoPlay);
//         video.addEventListener('pause', handleVideoPause);
//       });

//       // 플레이리스트 버튼 리스너 등록 (예시로 버튼에 data-vod-id 속성이 있다고 가정)
//       const playlistButtons = document.querySelectorAll('.playlist-button');
//       playlistButtons.forEach(button => {
//         button.addEventListener('click', handlePlaylistToggle);
//       });

//       // 정리 함수
//       return () => {
//         window.removeEventListener('click', handleClick);
//         window.removeEventListener('beforeunload', handleBeforeUnload);
//         videos.forEach(video => {
//           video.removeEventListener('play', handleVideoPlay);
//           video.removeEventListener('pause', handleVideoPause);
//         });
//         playlistButtons.forEach(button => {
//           button.removeEventListener('click', handlePlaylistToggle);
//         });
//       };
//     }, []);

//     return <WrappedComponent {...props} />;
//   };
// };

// export default logAction;

// //정확히 어떤 데이터를 전할지 정리해서 코드 수정해야함
// // 비디오 일시정지는 뺴야할지 싶음
// // 예고편 재생유무는 데이터로 넣어야하는지 고민
