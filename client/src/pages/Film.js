import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Review } from '../components/Review'

function Film() {
    const [ film, setFilm ] = useState('')
    const [ reviews, setReviews ] = useState([])
    const [ genres, setGenres ] = useState([])

    var pathArray = window.location.pathname.split('/');
    async function getMovie() {
        const data = await fetch("http://localhost:1234/api/movies/"+pathArray[2], {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            setFilm(res.movie)
            setReviews(res.movie.reviews)
            setGenres(res.movie.genres)
        } else {
            console.log('ERROR')
        }
    }

    useEffect(() => {
        getMovie()
    }, [])

    const rrs = []
    for (let r of reviews) {
        rrs.push(<Review review={r} key={r}/>)
    }

    const tags = []
    for (let t of genres) {
        tags.push(<p><span className="tag_span" key={t}>{t}</span></p>)
    }


    async function updateWatchlist(event) {
        event.preventDefault()

        const req = await fetch('http://localhost:1234/api/watchlist', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify ({
                watchlist: film.title
            })
        })

        const data = await req.json()
        if (data.status === 'ok') {
            alert(`${film.title} added to your watchlist`)
        } else {
            alert(data.error)
        }
    }

    return(
        <div className="page_container">
            <Navbar/>
            <div className="main_content">
                <div className="content_header">
                    <h1 id="film_title">{film.title}</h1>
                    <p><span className="rating_span">Add review</span></p>
                </div>
                <div className="content_main">
                    <div className="left_main">
                        <img id="film_cover" src={film.cover} width="80%"/>
                    </div>
                    <div className="right_main">
                        <div className="info">
                            <p id="film_year"><b>Release year</b>: {film.year}</p>
                            
                            <p id="film_cast"><b>Cast</b>: {film.cast}</p>
                        </div>
                        <div className="info_2">
                            <p><span onClick={updateWatchlist} className="watchlist_span">+ Watchlist</span></p>
                            <p id="film_starring_rating">Starring: {film["Starring rating"]}/10</p>
                            <p id="film_imdb_rating">IMDb: {film.rating}/10</p>
                        </div>
                        
                    </div>
                </div>
                <div className="content_footer">
                    <div className="footer_tag" id="film_tag">
                        {tags}
                    </div>
                    <div className="footer_description">
                        <p id="film_plot">{film.plot}</p>
                    </div>
                </div>
                <hr/>
                <div className="comment_container">
                    <div className="comment_container_title" id="review_container">
                        <h2>User reviews</h2>
                        <ul>{rrs}</ul>
                    </div>
                </div>
                <br/>
            </div>
        </div>
    )
}

export default Film