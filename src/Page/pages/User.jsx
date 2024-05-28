import React, { useState, useRef } from "react";
import axios from "axios";
import "../CSS/User.css";

function User() {
    const [USER_NAME, setUSER_NAME] = useState("");
    const [GENDER, setGENDER] = useState("");
    const [AGE, setAGE] = useState("");

    const nameInputRef = useRef(null);
    const genderInputRef = useRef(null);
    const ageInputRef = useRef(null);

    const UserInfoUpdate = async () => {
        const  SETTOP_NUM = localStorage.getItem('settop_num');
        
        const userInfo = {
          SETTOP_NUM:  SETTOP_NUM,
          USER_NAME: USER_NAME,
          GENDER: GENDER,
          AGE: AGE
        };
    
        try {
          const response = await axios.post('http://localhost:8000/signup',userInfo);
          if (response.status === 200) {
            setUSER_NAME("");  
            setGENDER("");
            setAGE("");
          } else {
            console.error('Failed to register user:', response.status);
          }
        } catch (error) {
          console.error('Failed to register user:', error);
          alert('회원정보 수정 실패');  
        }
      };

      const handleAGEChange = (e) => {
        setAGE(e.target.value);
      };
    
      const onChangeUSER_NAME = (e) => {
        setUSER_NAME(e.target.value);
      };
    
    return (
        <div className="user-info">
             <h2>회원정보</h2>
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
              <button onClick={UserInfoUpdate}>수정하기</button>
            </div>
    );
}

export default User;
//css 수정