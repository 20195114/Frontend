import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoLogoOctocat } from "react-icons/io5";
import '../CSS/User.css';

const MyMenu = ({
  userMenuVisible,
  toggleUserMenuVisibility,
  handleUserChange
}) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('user_list')) || [];
    setUsers(storedUsers);
  }, []);

  const handleUserClick = (user_id, user_name) => {
    localStorage.setItem('selectedUserId', user_id);
    localStorage.setItem('selectedUserName', user_name);
    handleUserChange(user_id, user_name);
  };

  return (
    <div className="user-container">
      <FaUser
        className="user-icon-men"
        onClick={toggleUserMenuVisibility}
      />
      {userMenuVisible && (
        <div className="user-menu active">
          {users.map(user => (
            <div key={user.user_id} className="user-menu-item" onClick={() => handleUserClick(user.user_id, user.user_name)}>
              <IoLogoOctocat className="user-icon-small" />
              <p>{user.user_name}</p>
            </div>
          ))}
          <div className="user-menu-item" onClick={() => navigate('/User')}>
            <p>마이페이지</p>
          </div>
          <div className="user-menu-item" onClick={() => navigate('/ReviewPage')}>
            <p>내가 쓴 리뷰 및 별점</p>
          </div>
          <div className="user-menu-item" onClick={() => navigate('/LoginComponent')}>
            <p>로그아웃</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMenu;
