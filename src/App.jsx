import React from "react";
import {Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import LoginComponent from './pages/LoginComponent';
import Main from "./pages/Main";
import SearchBar from './pages/SearchBar.tsx';
import Playlist from './pages/Playlist.jsx';
import User from './pages/User.jsx';
import Movie from "./pages/Movie.jsx";
import Series from "./pages/Series.jsx";
import Kids from "./pages/Kids.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";

function App() {
  return (
    <Routes>
      
        <Route path="/" element={<LoginComponent />} />
        <Route path="/About" element={<About />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Movie" element={<Movie />} />
        <Route path="/Series" element={<Series />} />
        <Route path="/Kids" element={<Kids />} />
        <Route path="/SearchBar" element={<SearchBar />} />
        <Route path="/Playlist" element={<Playlist />} />
        <Route path="/User" element={<User />} />
        <Route path="/MovieDetailPage" element={<MovieDetailPage />} />        
      
    </Routes>
  );
}

export default App;