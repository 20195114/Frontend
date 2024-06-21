import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/LoginComponent.css';

const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [settopNum, setSettopNum] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (msg && loading) {
      setTimeout(() => {
        setMsg('');
        setLoading(false);
      }, 1500);
    }
  }, [msg, loading]);

  const loginFunc = async (e) => {
    e.preventDefault();
    if (!settopNum) {
      setMsg('셋탑번호를 입력하세요.');
      return;
    } else {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/login/${settopNum}`);
        if (response.status === 200 && Array.isArray(response.data)) {
          const userList = response.data;
          if (userList.length > 0) {
            // 로컬 스토리지에서 세션 스토리지로 변경
            sessionStorage.setItem('user_list', JSON.stringify(userList));
            sessionStorage.setItem('settop_num', settopNum);
            setMsg('');
            setSettopNum(''); // 입력 필드 지우기
            navigate('/About');
          } else {
            setMsg('셋탑번호가 틀립니다.');
          }
        }
      } catch (error) {
        console.error('에러:', error);
        if (error.response && error.response.status === 400) {
          setMsg('셋탑번호가 틀립니다.');
        } else {
          setMsg('서버 에러가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <header><h1>Hello:D</h1></header>
      <main>
        <h2>나를 위한 추천 영화, 시리즈</h2>
        <form onSubmit={loginFunc}>
          <label htmlFor="settop_num">헬로:D에서 찾아보세요.</label>
          <div className="input-group">
            <input
              type="password"
              id="settop_num"
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
