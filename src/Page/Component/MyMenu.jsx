import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoLogoOctocat } from "react-icons/io5";
import axios from 'axios';
import '../CSS/MyMenu.css';

const MyMenu = ({ isVisible, setIsVisible, closeOthers, handleUserChange }) => {
  const [userList, setUserList] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Helper function to get data from session storage
  const getSessionStorageData = (key, defaultValue) => {
    const value = sessionStorage.getItem(key);
    return value ? value : defaultValue;
  };

  // Fetch user list from the server using settop number from session storage
  const fetchUsers = async () => {
    const settopNum = getSessionStorageData('settop_num', null);
    if (settopNum) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/login/${settopNum}`);
        if (response.status === 200) {
          setUserList(response.data);
        } else {
          console.error('Unexpected response status:', response.status);
          setMsg('사용자 데이터를 가져오는 중 오류 발생');
        }
      } catch (error) {
        console.error('Error fetching user list:', error);
        setMsg('사용자 데이터를 가져오는 중 오류 발생');
      }
    } else {
      console.error('Settop number not found in session storage');
      setMsg('셋탑 번호를 찾을 수 없습니다.');
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchUsers(); // Fetch user list whenever the menu becomes visible
    }
  }, [isVisible]);

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

    // Fetch user list from the server when menu is toggled to visible
    if (!isVisible) {
      fetchUsers();
    }
  };

  const handleUserClick = (user_id, user_name) => {
    const user = userList.find(user => user.USER_ID === user_id);

    if (user) {
      const { LIKE_STATUS } = user;

      sessionStorage.setItem('selectedUserId', user_id);
      sessionStorage.setItem('selectedUserName', user_name);
      sessionStorage.setItem('likeStatus', JSON.stringify(LIKE_STATUS));

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
          {userList.length > 0 ? (
            userList.map(user => (
              <div key={user.USER_ID} className="user-menu-item" onClick={() => handleUserClick(user.USER_ID, user.USER_NAME)}>
                <IoLogoOctocat className="user-icon-small" />
                <p>{user.USER_NAME}</p>
              </div>
            ))
          ) : (
            <p className="no-users-msg">{msg ? msg : '사용자 목록이 없습니다.'}</p>
          )}
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
