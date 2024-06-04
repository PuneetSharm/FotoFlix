import React from "react";
import { useState, useEffect } from "react";
import Lightbox from "react-image-lightbox";
import {FaDownload, FaShare, FaHeart, FaThumbsUp} from "react-icons/fa";
import "react-image-lightbox/style.css";


const Photos = ({searchQuery,isFavourite,onFavouriteClick, ...photo}) => {

const [loading, setLoading] = useState(false);
const [photos, setPhotos] = useState([]);
const [favouritePhotos, setFavouritePhotos] = useState([]);
const [lightboxIndex, setLightboxIndex] = useState(0);
const [isLightboxOpen, setIsLightboxOpen] = useState(false);
const [page, setPage] = useState(1);

useEffect(() => {
    const fetchImages = async () => {
        setLoading(true);
       const apiKey = process.env.REACT_APP_API_KEY;
       const mainUrl = `https://api.unsplash.com/photos/?client_id=`;
       let url = `${mainUrl}${apiKey}`;
        if(searchQuery){
            url=`https://api.unsplash.com/search/photos/?client_id=${apiKey}&query=${searchQuery}`;
        }

        url +=`&page=${page}`;
       try{
        const response = await fetch(url);
        const data = await response.json();
        setPhotos(data.results || data);
        setLoading(false);
       }
       catch(error){
        setLoading(false);
        alert(error);
       }
    }
    fetchImages();
},[searchQuery, page]);

useEffect(() => {
    const handleScroll = () => {
        if(!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 200){
            setPage((prevPage) => prevPage+1);
        }
    };
    window.addEventListener("scroll" , handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
},[loading]);

const handleFavClick = (photoId) => {
    const existingIndex = favouritePhotos.findIndex((favPhoto) => favPhoto.id === photoId);
    // console.log("line54 photos", existingIndex)
    if(existingIndex !== -1){
        setFavouritePhotos((prevFavourites) => {
            prevFavourites.filter((favPhoto) => favPhoto.id !== photoId);
        });
    }
    else{
        const photoToAdd = photos.find((photo) => photo.id === photoId);
        // console.log("line 61 photos",photoToAdd)
        setFavouritePhotos((prevFavourites) => [...prevFavourites,photoToAdd]);
    }
};

const handleShare = (photoUrl) => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent( `Check out this awesome photo: ${photoUrl}`)}`;
    window.open(shareUrl, "_blank");
};

const handleDownload = (photoUrl,photoId) => {
    const link = document.createElement("a");
    link.href = photoUrl;
    link.download = `photo_${photoId}.jpg`;
    link.click();
};

const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
}

const closeLightbox = () => {
    setIsLightboxOpen(false);
}

    return(
    <main>
        <section className="photos">
            <div className="photos-center">
            { loading ? (<p> Loading ...</p>) 
            : 
            ( photos.map((photo,index) => { 
                return <> 
                <article key = {photo.id} className={`photo 
                ${favouritePhotos.some((favPhoto) => favPhoto.id === photo.id) 
                    ? 'favourite-photo' : ""}`} onClick={()=>handleFavClick(photo.id)}>
                    <img src = {photo.urls.regular} alt={photo.description} onClick={() => openLightbox(index)}/>
                    <div className="photo-info">
                    <div className="photo-header">
                        <h4>{photo.user.name}</h4>
                        <button className={`favourite-btn 
                        ${favouritePhotos.some((favPhoto) => favPhoto.id === photo.id) 
                        ? 'active' : ''}`} onClick={() => handleFavClick(photo.id)}>
                           <FaHeart />
                        </button>
                    </div>
                    <div className="photo-actions">
                        <p>
                            <FaThumbsUp className="heart-icon" />{photo.likes}
                        </p>
                        <button className="share-btn" onClick={() => handleShare(photo.urls.regular)}>
                            <FaShare /> 
                        </button>
                        <button className="download-btn" onClick={() => handleDownload(photo.urls.full,photo.id)}>
                            <FaDownload /> 
                        </button>
                    </div>
                    <a href={photo.user.portfolio_url}>
                        <img src={photo.user.profile_image.medium} className="user-img" alt={photo.user.name}/>
                    </a>
                    </div>
                </article>
                </>
                })
            )}
            </div>
        </section>
        {isLightboxOpen && (
            <Lightbox mainSrc = {photos[lightboxIndex].urls.full} onCloseRequest = {closeLightbox} />
        ) }
    </main>
    );
};

export default Photos;