import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/LoginComponent.css';

function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [settop_num, setSettopNum] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (msg && loading) {
      setTimeout(() => {
        setMsg("");
        setLoading(false);
      }, 1500);
    }
  }, [msg, loading]);

  const LoginFunc = async (e) => {
    e.preventDefault();
    if (!settop_num) {
      setMsg("셋탑번호를 입력하세요.");
      return;
    } else {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/login/${settop_num}`);
        console.log(response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          const user_list = response.data;
          if (user_list.length > 0) {
            localStorage.setItem("user_list", JSON.stringify(user_list));
            localStorage.setItem("settop_num", settop_num);
            setMsg("");
            setSettopNum(""); // 입력 필드 지우기
            navigate('/About', { state: { user_list, settop_num } });
          } else {
            setMsg("셋탑번호가 틀립니다.");
          }
        } 
      } catch (error) {
        console.error("에러:", error);
        if (error.response && error.response.status === 400) {
          setMsg("셋탑번호가 틀립니다.");
        } else {
          setMsg("서버 에러가 발생했습니다.");
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
        <form onSubmit={LoginFunc}>
          <label htmlFor="settop_num">헬:D에서 찾아보세요.</label>
          <div className="input-group">
            <input
              type="password"
              id="settop_num"
              placeholder="셋탑번호 입력"
              value={settop_num}
              onChange={(e) => {
                setSettopNum(e.target.value);
              }}
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
}

export default LoginComponent;

