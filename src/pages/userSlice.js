import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    id: "",
    gender: "",
    spotifyLinked: false, 
    isLoggedIn: null, 
  },
  reducers: {
    loginUser: (state, action) => {
      state.name = action.payload.name; 
      state.id = action.payload.id; 
      state.isLoggedIn = true;
    },
    createUser: (state) => {
      state.name = "";
      state.id = "";
      state.isLoggedIn = false;
    },
    clearUser: (state) => {
      state.name = "";
      state.id = "";
      state.isLoggedIn = null;
    },
    // Spotify 연동 상태를 설정하는 액션 추가
    setSpotifyLinked: (state, action) => {
      // 연동된 상태에서만 변경 가능하도록 설정
      if (state.spotifyLinked === false) {
        state.spotifyLinked = action.payload;
      }
    },
  },
});

export const { loginUser, createUser, clearUser, setSpotifyLinked } = userSlice.actions;
export default userSlice.reducer;
