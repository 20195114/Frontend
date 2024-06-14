import React from "react";
import {Routes, Route } from 'react-router-dom';
import About from './Page/pages/About.jsx';
import LoginComponent from './Page/pages/LoginComponent';
import Main from "./Page/pages/Main";
import SearchBar from './Page/pages/SearchBar.tsx';
import Playlist from './Page/pages/Playlist.jsx';
import User from './Page/pages/User.jsx';
import Movie from "./Page/pages/Movie.jsx";
import Series from "./Page/pages/Series.jsx";
import Kids from "./Page/pages/Kids.jsx";
import MovieDetailPage from "./Page/pages/MovieDetailPage.jsx";
import ReviewPage from "./Page/pages/ReviewPage.jsx";


//dddd
function App() {
  return (
    <Routes>
      
        <Route path="/" element={<LoginComponent />} />
        <Route path="/LoginComponent" element={<LoginComponent />} />
        <Route path="/About" element={<About />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Movie" element={<Movie />} />
        <Route path="/Series" element={<Series />} />
        <Route path="/Kids" element={<Kids />} />
        <Route path="/SearchBar" element={<SearchBar />} />
        <Route path="/Playlist" element={<Playlist />} />
        <Route path="/User" element={<User />} />
        <Route path="/MovieDetailPage" element={<MovieDetailPage />} /> 
        <Route path="/ReviewPage" element={<ReviewPage />} />        
       
      
    </Routes>
  );
}

export default App;