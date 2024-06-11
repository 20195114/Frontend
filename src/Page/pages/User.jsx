import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../CSS/User.css";
import { IoLogoOctocat } from "react-icons/io5";

function User() {
  const [user, setUser] = useState({ USER_NAME: "", GENDER: "", AGE: "" });
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('selectedUserId'));

  const nameInputRef = useRef(null);
  const ageInputRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setErrorMessage('로그인 정보가 없습니다. 로그인 후 다시 시도해 주세요.');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/user/${userId}`);
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setErrorMessage('사용자 데이터를 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        setErrorMessage('사용자 데이터를 가져오는 데 실패했습니다.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUserInfoUpdate = async () => {
    const SETTOP_NUM = localStorage.getItem('settop_num');

    const updatedUserInfo = {
      SETTOP_NUM,
      USER_NAME: user.USER_NAME,
      GENDER: user.GENDER,
      AGE: user.AGE
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/signup`, updatedUserInfo);
      if (response.status === 200) {
        setEditMode(false);
        setUser(response.data);
        setErrorMessage('');
      } else {
        setErrorMessage('회원정보 수정에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('회원정보 수정에 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  return (
    <div className="user-info">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {!editMode ? (
        <>
          <h2>프로필</h2>
          <div className="user-details">
            <IoLogoOctocat size={100} />
            <p>이름: {user.USER_NAME}</p>
            <p>성별: {user.GENDER}</p>
            <p>나이: {user.AGE}세</p>
          </div>
          <button onClick={() => setEditMode(true)}>편집</button>
        </>
      ) : (
        <>
          <h2>프로필 수정</h2>
          <div className="edit-user-details">
            <IoLogoOctocat size={100} />
            <input
              type="text"
              name="USER_NAME"
              placeholder="이름"
              ref={nameInputRef}
              value={user.USER_NAME}
              onChange={handleInputChange}
            />
            <div>
              <label>성별:</label>
              <input
                type="radio"
                name="GENDER"
                value="남성"
                checked={user.GENDER === "남성"}
                onChange={handleInputChange}
              /> 남성
              <input
                type="radio"
                name="GENDER"
                value="여성"
                checked={user.GENDER === "여성"}
                onChange={handleInputChange}
              /> 여성
            </div>
            <input
              type="number"
              name="AGE"
              placeholder="나이"
              ref={ageInputRef}
              value={user.AGE}
              onChange={handleInputChange}
            />
            <button onClick={() => setEditMode(false)}>취소</button>
            <button onClick={handleUserInfoUpdate}>저장</button>
          </div>
        </>
      )}
    </div>
  );
}

export default User;
