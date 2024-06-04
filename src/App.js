import './App.css';
import React from 'react';
import Photos from './Components/Photos';
import { BrowserRouter,Routes,Route,Link } from 'react-router-dom';
import { useState } from 'react';
import {FaSearch} from "react-icons/fa";
import Favourite from './Components/Favourite';


function App() {
const [searchQuery,setSearchQuery] = useState("");
const [favouritePhotos, setFavouritePhotos] = useState([]);

const handleSearch = (e) => {
e.preventDefault();
setSearchQuery(e.target[0].value);
}

const handleAddFavourite = (photo) => {
  setFavouritePhotos((prevFavourites) => [...prevFavourites,photo]);
};

const handleRemoveFavourite = (photoId) => {
  setFavouritePhotos((prevFavourites) => {
    prevFavourites.filter((favPhoto) => favPhoto.id !== photoId);
  })
}


  return (
    <BrowserRouter>
      <div>
        <nav className='navbar'>
          <div className='navbar__logo'>
            FotoFlix
          </div>
          <form action='' className='navbar__search-form search-form' onSubmit={handleSearch}>
            <input type='text' className='form-input focused' placeholder='search' />
            <button type='submit' className='submit-btn' >
              <FaSearch />
              </button> 
          </form>
          <div className='navbar__links'>
            {/* <Link to="/">Home</Link> */}
            <Link to="/favourites">Favourite</Link>
          </div>
        </nav>
        <Routes>
          <Route path='/' element={<Photos searchQuery={searchQuery} onFavouriteClick={handleAddFavourite}/>} />
          <Route path='/favourites' element={<Favourite favouritePhotos={favouritePhotos} handleRemoveFavourite={handleRemoveFavourite}/>} />
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
