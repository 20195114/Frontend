import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../CSS/User.css";
import { IoLogoOctocat } from "react-icons/io5";

function User() {
    const [user, setUser] = useState({ USER_NAME: "", GENDER: "", AGE: "" });
    const [editMode, setEditMode] = useState(false);

    const nameInputRef = useRef(null);
    const ageInputRef = useRef(null);

    useEffect(() => {
        // 백엔드에서 사용자 데이터 가져오기
        const fetchUserData = async () => {
            const SETTOP_NUM = localStorage.getItem('settop_num');
            try {
                const response = await axios.get(`http://localhost:8000/user/${SETTOP_NUM}`);
                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleUserInfoUpdate = async () => {
        const SETTOP_NUM = localStorage.getItem('settop_num');

        const updatedUserInfo = {
            SETTOP_NUM: SETTOP_NUM,
            USER_NAME: user.USER_NAME,
            GENDER: user.GENDER,
            AGE: user.AGE
        };

        try {
            const response = await axios.post('http://localhost:8000/signup', updatedUserInfo);
            if (response.status === 200) {
                setEditMode(false);
                setUser(response.data); // 업데이트된 사용자 데이터 다시 불러오기
            } else {
                console.error('Failed to update user:', response.status);
                alert('회원정보 수정 실패');
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('회원정보 수정 실패');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    return (
        <div className="user-info">
            {!editMode ? (
                <>
                    <h2>프로필</h2>
                    <div className="user-details">
                        <img src={IoLogoOctocat} alt="User Icon" />
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
                        <img src={IoLogoOctocat} alt="User Icon" />
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
