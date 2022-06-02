import React, { useEffect, useState } from 'react'
import '../css/style.css'

export function Navbar() {
    const [ user, setUser ] = useState('')
    const [ filmFound, setFilmFound ] = useState([])
    const [ showSearch, setShowSearch] = useState(false)
    const [ reftime, setReftime] = useState(null)

    async function getUser() {
        if(localStorage.getItem('token') == null) return
        
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
        getUser()
    }, [])

    async function getMovie(movie) {
        const data = await fetch("http://localhost:1234/api/search?search="+movie, {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            setFilmFound(res.movie)
        } else {
            setFilmFound([])
            console.log('ERROR')
        }
    
    }

    async function showSearchHandler(e) { // per permettere ai sottoelementi di essere cliccati senza che si perda il focus
        if (e.type == 'focus') {
            setShowSearch(true)
            clearTimeout(reftime)
        } else if(e.type == 'blur') {
            setReftime(setTimeout(() => setShowSearch(false), 0))
        }
    }

    return(
    <nav>
        <div className="navbar_container">
            <a href="/homepage">STARRING</a>
            <div className="search-navbar_container">
                <form action="/search" method="get" autoComplete='off'>
                    <div className='autocomplete' onFocus={showSearchHandler} onBlur={showSearchHandler}>
                        <input type="text" placeholder="Search" name="search" onChange={e => getMovie(e.target.value)}/>

                        {showSearch &&
                            <div className='autocomplete-items'>
                                {
                                filmFound.length > 0 ? filmFound.slice(0,3).map((film) => (
                                        <div key={film._id}>
                                            <a href={"/film/"+film.title}>{film.title}</a>
                                        </div>
                                    )) : <p>No movie found!</p>
                                }
                            </div>
                        }
                    </div>
                    <button type="submit"><i className="fa fa-search"></i></button>
                </form>
                </div>
            
            {!user.username && <a href="/login">Login</a>}
            {!user.username && <a href="/register">Sign-up</a>}
            {user.mod && <a href="/moderator"><i className="fas fa-user-cog"></i></a>}
            {user.username && <a href="#"><i className="fa fa-sign-out"></i></a>}
        </div>
    </nav>
    )
}

