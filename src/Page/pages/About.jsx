import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "../CSS/About.css";
import axios from 'axios';
import { IoLogoOctocat } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import logo from '../URL/logoHelloD.png';

const Background = styled.div`
  background-color: black;
`;

const AddUserButton = styled(FaPlus)`
  font-size: 4rem;
  color: #fff;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s;

  @media (max-width: 1200px) {
    font-size: 4rem;
  }

  @media (max-width: 992px) {
    font-size: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 576px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

function About() {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // 모달 열기/닫기 상태
  const [userName, setUserName] = useState(""); // 사용자 이름 상태
  const [gender, setGender] = useState(""); // 성별 상태
  const [age, setAge] = useState(""); // 나이 상태
  const [msg, setMsg] = useState(""); // 메시지 상태

  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 실행
  useEffect(() => {
    const settopNum = sessionStorage.getItem('settop_num');
    if (settopNum) {
      fetchUsers(settopNum);
    } else {
      setMsg("셋탑 번호를 찾을 수 없습니다.");
      console.error("셋탑 번호를 찾을 수 없습니다.");
    }
  }, []);

  // URL 변경 감지 및 재요청
  useEffect(() => {
    const handlePopState = () => {
      reFetchCurrentURL();
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 페이지가 새로고침되거나 URL 변경 시 데이터 다시 가져오기
  useEffect(() => {
    window.addEventListener('load', reFetchCurrentURL);

    return () => {
      window.removeEventListener('load', reFetchCurrentURL);
    };
  }, []);

  // 현재 URL로 재요청하는 함수
  const reFetchCurrentURL = async () => {
    try {
      const settopNum = sessionStorage.getItem('settop_num');
      
      if (!settopNum) {
        setMsg("셋탑 번호를 찾을 수 없습니다.");
        console.error("셋탑 번호를 찾을 수 없습니다.");
        return;
      }
      
      // URL이 변경된 후 데이터를 다시 요청합니다.
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/login/${settopNum}`);
      console.log('재요청 성공:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('페이지를 다시 로드하는 중 오류 발생:', error);
      setMsg('페이지를 다시 로드하는 중 오류 발생.');
    }
  };

  // 사용자 목록을 백엔드에서 가져오는 함수
  const fetchUsers = async (settopNum) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/login/${settopNum}`);
      if (response.status === 200) {
        setUsers(response.data);
      } else {
        console.error('예상치 못한 응답 상태:', response.status);
        setMsg('사용자 데이터를 가져오는 중 오류 발생');
      }
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
      setMsg('사용자 데이터를 가져오는 중 오류 발생');
    }
  };

  // 사용자를 선택했을 때 실행되는 함수
  const handleUserClick = (userId, userName, likeStatus) => {
    sessionStorage.setItem('selectedUserId', userId);
    sessionStorage.setItem('selectedUserName', userName);
    sessionStorage.setItem('likeStatus', JSON.stringify(likeStatus)); // LIKE_STATUS 저장
    navigate('/Main'); // Main 페이지로 이동

    // 페이지 이동 후 URL이 변경되었음을 감지하고 데이터 다시 가져오기
    setTimeout(() => {
      const settopNum = sessionStorage.getItem('settop_num');
      if (settopNum) {
        fetchUsers(settopNum);
      }
    }, 1000);
  };

  // 사용자 추가 버튼 클릭 시 실행
  const handleAddUser = () => {
    setIsSignupModalOpen(true); // 모달 열기
  };

  // 회원가입 처리 함수
  const handleSignup = async () => {
    const settopNum = sessionStorage.getItem('settop_num');

    // 모든 필드가 입력되었는지 확인
    if (!userName || !gender || !age) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const newUser = {
      SETTOP_NUM: settopNum,
      USER_NAME: userName,
      GENDER: gender,
      AGE: parseInt(age)
    };

    console.log('전송할 데이터:', newUser); // 전송할 데이터 로그

    try {
      const response = await axios.post(`${process.env.REACT_APP_CUD_ADDRESS}/user/`, newUser);

      console.log('서버 응답:', response); // 서버 응답 로그

      if (response.status === 200) {
        fetchUsers(settopNum); // 등록 후 사용자 목록 갱신
        setIsSignupModalOpen(false); // 모달 닫기
        setUserName(""); // 필드 초기화
        setGender("");
        setAge("");
        setMsg("사용자 등록이 완료되었습니다."); // 성공 메시지
      } else {
        console.error('사용자 등록 실패:', response.status);
        alert('사용자 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 등록 중 오류 발생:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  // 나이 선택 시 실행
  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  // 이름 입력 시 실행
  const onChangeUserName = (e) => {
    setUserName(e.target.value);
  };

  return (
    <Background>
      <header>
        <div className="Logo">
          <img src={logo} alt="Hell:D Logo" className="logo-image" />
        </div>
      </header>
      <main>
        <div className="user-selection-page">
          <h1>여러분의 웃음과 함께 하는 헬로:D</h1>
          <p>사용자를 선택하여 계속하세요.</p>
          <div className="user-grid">
            {users.map((user) => (
              <div key={user.USER_ID} className="user-card" onClick={() => handleUserClick(user.USER_ID, user.USER_NAME, user.LIKE_STATUS)}>
                <IoLogoOctocat className="user-icon-cat" />
                <p>{user.USER_NAME}</p>
              </div>
            ))}
            {users.length < 4 && (
              <AddUserButton onClick={handleAddUser} />
            )}
          </div>
          {isSignupModalOpen && (
            <div className="signup-modal">
              <div className="signup-modal-content">
                <span className="close" onClick={() => setIsSignupModalOpen(false)}>&times;</span>
                <h2>회원가입</h2>
                <input
                  type="text"
                  placeholder="이름"
                  value={userName}
                  onChange={onChangeUserName}
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">성별 선택</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
                <select
                  value={age}
                  onChange={handleAgeChange}
                >
                  <option value="">나이 선택</option>
                  {Array.from({ length: 100 }, (_, i) => i).map((age) => (
                    <option key={age} value={age}>{age}세</option>
                  ))}
                </select>
                <button onClick={handleSignup}>가입하기</button>
                <button onClick={() => setIsSignupModalOpen(false)}>취소</button>
              </div>
            </div>
          )}
          {msg && <div className="msg">{msg}</div>}
        </div>
      </main>
    </Background>
  );
}

export default About;
