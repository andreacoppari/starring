import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { PopupForm } from '../components/PopupForm'

function Film() {
    const [ btnPopup, setBtnPopup ] = useState(false)
    const [ film, setFilm ] = useState('')
    const [ review, setReview ] = useState('')
    const [ user, setUser ] = useState('')

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
        } else {
            console.log('ERROR')
        }
    }

    async function getUser() {
        if (localStorage.getItem('token') == null) return
    
        const data = await fetch("http://localhost:1234/api/user", {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            setUser(res.user)
        } else {
            console.log('ERROR')
        }
    }

    useEffect(() => {
        getMovie()
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
            alert(`Review added to ${film.title} successfully!`)
        } else {
            alert(data.error)
        }
    }
    useEffect(() => {
        getUser()
    }, [])

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
            alert(film.title + data.msg)
        } else {
            alert(data.error)
        }
    }

    async function banReview(event, review) {
        event.preventDefault()
        console.log(event)
        const req = await fetch('http://localhost:1234/api/mod-banreview', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify ({
                review: review
            })
        })

        const data = await req.json()
        if (data.status === 'ok') {
            alert(`review removed`)
            getMovie()
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
                            <p><span onClick={updateWatchlist} className="watchlist_span">+ Watchlist</span></p>
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
                        {!user.mod && film.reviews?.map((item, i) => { 
                                return(
                                <div className='comment' key={i}>
                                    <div className="comment_text">
                                        <p>{item}</p>
                                    </div>
                                </div>
                                )
                            })}
                        {user.mod && film.reviews?.map((item, i) => { 
                                return(
                                <div onClick={e => banReview(e, item)} className='comment comment_clickable' key={i}>
                                    <div className='comment_ban'>
                                        Ban
                                    </div>
                                    <div className="comment_text">
                                        <p>{item}</p>
                                    </div>
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