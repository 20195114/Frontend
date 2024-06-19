import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoLogoOctocat } from "react-icons/io5";
import axios from 'axios';
import '../CSS/MyMenu.css';

const MyMenu = ({ isVisible, setIsVisible, closeOthers, handleUserChange }) => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    // localStorage에서 유저 목록을 가져옵니다.
    const storedUsers = JSON.parse(localStorage.getItem('user_list')) || [];
    setUserList(storedUsers);
  }, []);

  useEffect(() => {
    // 메뉴 외부 클릭 시 메뉴를 닫습니다.
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsVisible]);

  const handleIconClick = () => {
    closeOthers();
    setIsVisible((prev) => !prev);
  };

  const handleUserClick = async (user_id, user_name) => {
    const user = userList.find(user => user.USER_ID === user_id);

    if (user) {
      const { LIKE_STATUS } = user;

      // localStorage에 선택한 유저 정보를 저장합니다.
      localStorage.setItem('selectedUserId', user_id);
      localStorage.setItem('selectedUserName', user_name);
      localStorage.setItem('likeStatus', JSON.stringify(LIKE_STATUS));

      try {
        // 백엔드에서 유저의 VOD 데이터를 가져옵니다.
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}}/user/${user_id}/vods`);
        const userVods = response.data;

        // 메인 페이지의 상태를 업데이트하기 위해 handleUserChange를 호출합니다.
        handleUserChange({
          userId: user_id,
          userName: user_name,
          likeStatus: LIKE_STATUS,
          vods: userVods
        });

        // 메인 페이지로 이동합니다.
        navigate('/Main');
      } catch (error) {
        console.error('유저 VOD 데이터를 로딩 중 오류 발생:', error);
        alert('유저 VOD 데이터를 로딩하는 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <div className="user-container" ref={menuRef}>
      <FaUser
        className="user-icon-men"
        onClick={handleIconClick}
        aria-label="Toggle user menu"
      />
      {isVisible && (
        <div className="user-menu active">
          {userList.map(user => (
            <div key={user.USER_ID} className="user-menu-item" onClick={() => handleUserClick(user.USER_ID, user.USER_NAME)}>
              <IoLogoOctocat className="user-icon-small" />
              <p>{user.USER_NAME}</p>
            </div>
          ))}
          <div className="user-menu-item" onClick={() => navigate('/User')}>
            <div style={{ fontSize: '20px' }}>마이페이지</div>
          </div>
          <div className="user-menu-item" onClick={() => navigate('/ReviewPage')}>
            <div style={{ fontSize: '20px' }}>내가 쓴 리뷰 및 별점</div>
          </div>
          <div className="user-menu-item" onClick={() => navigate('/LoginComponent')}>
            <div style={{ fontSize: '20px' }}>로그아웃</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMenu;
// 유저 변경 error