import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { PopupForm } from '../components/PopupForm'

function Film() {
    const [ btnPopup, setBtnPopup ] = useState(false)
    const [ film, setFilm ] = useState('')
    const [ review, setReview ] = useState('')
    const [ watchlist, setWatchlist ] = useState([])

    var pathArray = window.location.pathname.split('/');
    async function getMovie() {
        const data = await fetch("http://localhost:1234/api/movies/"+pathArray[2], {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            res.movie.reviews.reverse()
            setFilm(res.movie)
        } else {
            console.log('ERROR')
        }
    }

    async function getWatchlist() {
        const req = await fetch('http://localhost:1234/api/watchlist', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setWatchlist(data.watchlist)
        } else {
            console.log('ERROR')
        }
    }

    useEffect(() => {
        getMovie()
    }, [])

    useEffect(() => {
        getWatchlist()
    }, [])

    async function updateReviews(event) {
        event.preventDefault()

        const req = await fetch('http://localhost:1234/api/addreview', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify ({
                movie: film.title,
                review: review,
            }),
        })

        const data = await req.json()
        if (data.status === 'ok') {
            const newFilm = {...film}
            newFilm.reviews.unshift(review)
            setFilm(newFilm)
            alert(`Review added to ${film.title} successfully!`)
        } else {
            alert(data.error)
        }
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
            const newWachlist = []
            watchlist.forEach(f => f._id !== film._id && newWachlist.push(f))
            newWachlist.length === watchlist.length && newWachlist.push(film)
            setWatchlist(newWachlist)
            alert(film.title + data.msg)
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
                    <p><span className="rating_span" onClick={() => setBtnPopup(true)}>Add review</span></p>
                    <div className="popup-form">
                        <PopupForm trigger={btnPopup} setTrigger={setBtnPopup}>
                            <form onSubmit={updateReviews}>
                                <textarea
                                className='review'
                                type="text"
                                placeholder="Insert your review here"
                                onChange={(e) => {
                                    setReview(e.target.value)
                                }}
                                />
                                <div className="clearfix">
                                    <button type="submit">Add review</button>
                                </div>
                            </form>
                        </PopupForm>
                    </div>
                </div>
                <div className="content_main">
                    <div className="left_main">
                        <img id="film_cover" src={film.cover} width="80%" alt={film.title}/>
                    </div>
                    <div className="right_main">
                        <div className="info">
                            <p id="film_year"><b>Release year</b>: {film.year}</p>
                            
                            <p id="film_cast"><b>Cast</b>: {film.cast?.slice(0, 8).join(", ")}</p>
                        </div>
                        <div className="info_2">
                            <p><span onClick={updateWatchlist} className="watchlist_span">{watchlist.find(f => f._id === film._id) ? "-" : "+"} Watchlist</span></p>
                            <p id="film_starring_rating">Starring: {film["Starring rating"]}/10</p>
                            <p id="film_imdb_rating">IMDb: {film.rating}/10</p>
                        </div>
                        
                    </div>
                </div>
                <div className="content_footer">
                    <div className="footer_tag" id="film_tag">
                    {film.genres?.map((item, i) => { 
                                return(
                                <p key={i}><span className="tag_span">{item}</span></p>
                                )
                            })}
                    </div>
                    <div className="footer_description">
                        <p id="film_plot">{film.plot}</p>
                    </div>
                </div>
                <hr/>
                <div className="comment_container">
                    <div className="comment_container_title" id="review_container">
                        <h2>User reviews</h2>
                        {film.reviews?.map((item, i) => { 
                                return(
                                <div className='comment' key={i}>
                                    <p>{item}</p>
                                </div>
                                )
                            })}
                    </div>
                </div>
                <br/>
            </div>
        </div>
    )
}

export default Film