import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/LoginComponent.css';

function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [settop_num, setsettop_num] = useState("");
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
        const body = { settop_num };
        const response = await axios.post('http://localhost:8000/login', body); // userlist
        console.log(response.data);
        switch (response.request.status) {
          case 200:
            console.log("로그인");
            const user_list = response.data.user_list; // 백엔드에서 받아온 사용자 데이터 -> back에서 보내는 데이터는 {id:['asd','asd']}여서 구조 수정했습니다.
            localStorage.setItem("user_list", JSON.stringify(response.data.user_list)); // 'user_list' 로컬 스토리지에 저장
            localStorage.setItem("settop_num", JSON.stringify(settop_num)); // 로컬 스토리지에 셋탑번호 저장
            setMsg("");
            navigate('/About', { state: { user_list, settop_num} });
            break;
          case 400:
            setMsg("비밀번호가 비어있습니다.");
            break;
          case 401:
            setMsg("존재하지 않는 비밀번호입니다.");
            break;
          case 402:
            setMsg("비밀번호가 틀립니다.");
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("에러:", error);
      }
    }
    setLoading(true);
  };

  return (
    <div className="login-container">
      <h1>나를 위한 추천 영화, 시리즈</h1>
      <form onSubmit={LoginFunc}>
        <label htmlFor="settop_num">헬:D에서 찾아보세요. </label>
        <div className="input-group">
          <input
            type="password"
            id="settop_num"
            placeholder="셋탑번호 입력"
            value={settop_num}
            onChange={(e) => {
              setsettop_num(e.target.value)
            }}
          />
          <button type="submit" disabled={loading}>
            시작하기
          </button>
        </div>
        {msg && <div>{msg}</div>} {/* 메시지가 존재할 때만 렌더링 */}
      </form>
    </div>
  );
}

export default LoginComponent;
