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
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_EC2_ADDRESS}/users/${settop_num}`); // URL에 settop_num 포함
        console.log(response.data);
        switch (response.status) {
          case 200:
            console.log("로그인");
            const user_list = response.data.user_list; // 백엔드에서 받아온 사용자 데이터
            localStorage.setItem("user_list", JSON.stringify(user_list)); // 'user_list' 로컬 스토리지에 저장
            localStorage.setItem("settop_num", settop_num); // 로컬 스토리지에 셋탑번호 저장
            setMsg("");
            navigate('/About', { state: { user_list, settop_num } });
            break;
          case 400:
            setMsg("셋탑번호가 비어있습니다.");
            break;
          case 401:
            setMsg("존재하지 않는 셋탑번호입니다.");
            break;
          case 402:
            setMsg("셋탑번호가 틀립니다.");
            break;
          default:
            setMsg("알 수 없는 오류가 발생했습니다.");
            break;
        }
      } catch (error) {
        console.error("에러:", error);
        if (error.response && error.response.status === 404) {
          setMsg("셋탑번호를 찾을 수 없습니다.");
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
              setsettop_num(e.target.value);
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
