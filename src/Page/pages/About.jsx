import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "../CSS/About.css";
import axios from 'axios';
import { IoLogoOctocat } from "react-icons/io";

const Background = styled.div`
  background-color: black;
`;

function About() {
  const [users, setUsers] = useState([]);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [USER_NAME, setUSER_NAME] = useState("");
  const [GENDER, setGENDER] = useState("");
  const [AGE, setAGE] = useState("");

  const nameInputRef = useRef(null);
  const genderInputRef = useRef(null);
  const ageInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const settopnum = localStorage.getItem('settop_num');
      if (!settopnum) {
        console.error("Set-top number is missing."); 
        return; 
      }
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/users/${settopnum}`);
      if (response.status === 200) {
        setUsers(response.data.user_list);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleUserClick = (user_id, user_name) => {
    localStorage.setItem('selectedUserId', user_id);
    localStorage.setItem('selectedUserName', user_name);  
    navigate('/Main');
  };

  const handleAddUser = () => {
    setIsSignupModalOpen(true);
  };

  const handleSignup = async () => {
    const SETTOP_NUM = localStorage.getItem('settop_num');
    
    const newUser = {
      SETTOP_NUM: SETTOP_NUM,
      USER_NAME: USER_NAME,
      GENDER: GENDER,
      AGE: AGE
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_EC2_ADDRESS}/user`, newUser);
      if (response.status === 200) {
        fetchUsers();  
        setIsSignupModalOpen(false);  
        setUSER_NAME("");  
        setGENDER("");
        setAGE("");
      } else {
        console.error('Failed to register user:', response.status);
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      alert('회원가입 실패');  
    }
  };

  const handleAGEChange = (e) => {
    setAGE(e.target.value);
  };

  const onChangeUSER_NAME = (e) => {
    setUSER_NAME(e.target.value);
  };

  return (
    <Background>
      <div className="Logo">헬:D</div>
      <div className="user-selection-page">
        <h1>여러분의 웃음과 함께 하는 헬:D</h1>
        <p>사용자를 선택하여 계속하세요.</p>
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.user_id} className="user-card" onClick={() => handleUserClick(user.user_id, user.user_name)}>
              <IoLogoOctocat className="user-icon" />
              <p>{user.user_name}</p>
            </div>
          ))}
        </div>
        {users.length < 4 && (
          <button id="addUserButton" onClick={handleAddUser}>사용자 추가</button>
        )}
        {isSignupModalOpen && (
          <div className="signup-modal">
            <div className="signup-modal-content">
              <span className="close" onClick={() => setIsSignupModalOpen(false)}>&times;</span>
              <h2>회원가입</h2>
              <input 
                type="text"
                placeholder="이름"
                ref={nameInputRef}
                value={USER_NAME} 
                onChange={onChangeUSER_NAME}
              />
              <select
                ref={genderInputRef}
                value={GENDER} 
                onChange={(e) => setGENDER(e.target.value)} 
              >
                <option value="">성별 선택</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
              <select
                ref={ageInputRef}
                value={AGE} 
                onChange={handleAGEChange}
                size="1" 
              >
                <option value="">나이 선택</option>
                {Array.from({ length: 100 }, (_, i) => i).map((AGE) => (
                  <option key={AGE} value={AGE}>{AGE}세</option>
                ))}
              </select>
              <button onClick={handleSignup}>가입하기</button>
              <button onClick={() => setIsSignupModalOpen(false)}>취소</button>
            </div>
          </div>
        )}
      </div>
    </Background>
  );
}

export default About;
