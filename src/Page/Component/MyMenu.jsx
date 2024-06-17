import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoLogoOctocat } from "react-icons/io5";
import '../CSS/MyMenu.css';

const MyMenu = ({ isVisible, setIsVisible, closeOthers, users, userMenuVisible, toggleUserMenuVisibility, handleUserChange }) => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('user_list')) || [];
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
    localStorage.setItem('selectedUserId', user_id);
    localStorage.setItem('selectedUserName', user_name);
    handleUserChange(user_id, user_name);
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
