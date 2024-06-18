import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/LoginComponent.css';

const LoginComponent = () => {
  const [settopNum, setSettopNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!settopNum) {
      setMsg("셋탑번호를 입력하세요.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/login/${settopNum}`);
      if (response.status === 200 && response.data) {
        const userList = response.data;
        sessionStorage.setItem('userList', JSON.stringify(userList));
        sessionStorage.setItem('settopNum', settopNum);
        navigate('/About');
      } else {
        setMsg("셋탑번호가 틀립니다.");
      }
    } catch (error) {
      setMsg("서버 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header><h1>Hello:D</h1></header>
      <main>
        <h2>나를 위한 추천 영화, 시리즈</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="settopNum">헬로:D에서 찾아보세요.</label>
          <div className="input-group">
            <input
              type="password"
              id="settopNum"
              placeholder="셋탑번호 입력"
              value={settopNum}
              onChange={(e) => setSettopNum(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              시작하기
            </button>
          </div>
          {msg && <div className="msg">{msg}</div>}
        </form>
      </main>
    </div>
  );
};

export default LoginComponent;
