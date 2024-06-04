import React from "react";
import Photos from "./Photos";
import { Link } from "react-router-dom";

const Favourite = ({favouritePhotos, handleRemoveFavourite}) => {
    return(
        <>
        <nav className="navbar">
            <div className="navbar__logo">FotoFlix</div>
            <div className='navbar__links'>
            <Link to="/">Home</Link>
            </div>
        </nav>
        <main>
            <section className="photos">
                {favouritePhotos.length > 0 ? (
                favouritePhotos.map((image,index) => {
                    return(
                        <Photos key={index} {...image} isFavourite={true} onFavouriteClick = {() => handleRemoveFavourite(image.id)}>
                            <span>Added to favourites</span>
                        </Photos>
                    )
                })) : (
                    <p>No favourite photos yet</p>
                )
            }
            </section>
        </main>
      </>  
    );
}

export default Favourite;