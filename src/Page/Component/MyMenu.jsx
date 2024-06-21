import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoLogoOctocat } from "react-icons/io5";
import '../CSS/MyMenu.css';

const MyMenu = ({ isVisible, setIsVisible, closeOthers, handleUserChange }) => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Helper function to get data from session storage
  const getSessionStorageData = (key, defaultValue) => {
    const value = sessionStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error parsing session storage data for ${key}:`, error);
      return defaultValue;
    }
  };

  // Helper function to set data in session storage
  const setSessionStorageData = (key, data) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting session storage data for ${key}:`, error);
    }
  };

  useEffect(() => {
    const storedUsers = getSessionStorageData('user_list', []);
    setUserList(storedUsers);
  }, []);

  useEffect(() => {
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

  const handleUserClick = (user_id, user_name) => {
    const user = userList.find(user => user.USER_ID === user_id);

    if (user) {
      const { LIKE_STATUS } = user;

      setSessionStorageData('selectedUserId', user_id);
      setSessionStorageData('selectedUserName', user_name);
      setSessionStorageData('likeStatus', JSON.stringify(LIKE_STATUS));

      handleUserChange({
        userId: user_id,
        userName: user_name,
        likeStatus: LIKE_STATUS,
        vods: {} // VOD 데이터는 메인 페이지에서 가져옵니다.
      });

      setIsVisible(false);
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
          <div className="user-menu-item" onClick={() => navigate('/')}>
            <div style={{ fontSize: '20px' }}>로그아웃</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMenu;
