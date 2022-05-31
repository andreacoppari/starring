import React, { useEffect, useState } from 'react'
import '../css/style.css'

export function Navbar() {
    const [ user, setUser ] = useState('')
    const [ filmFound, setFilmFound ] = useState([])
    const [ showSearch, setShowSearch] = useState(false)

    async function getUser() {
        if(localStorage.getItem('token') == null) return
        
        const data = await fetch("http://localhost:1234/api/user", {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        })
        const res = await data.json()
        console.log(res)
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

    return(
    <nav>
        <div className="navbar_container">
            <a href="/homepage">STARRING</a>
            <div className="search-navbar_container">
                <form action="/search" method="get" autoComplete='off'>
                    <div className='autocomplete' onFocus={e => setShowSearch(true)}>
                        <input type="text" placeholder="Search" name="search" onChange={e => getMovie(e.target.value)}/>

                        {showSearch &&
                            <div className='autocomplete-items'>
                                {
                                filmFound.length > 0 ? filmFound.slice(0,3).map((film) => (
                                        <div key={film._id}>
                                            <a href={"/film/"+`${film.title}`}>{film.title}</a>
                                        </div>
                                    )) : <p>No movie found!</p>
                                }
                            </div>
                        }
                    </div>
                    <button type="submit"><i className="fa fa-search"></i></button>
                </form>
                </div>
            <a href="/login"><i className="fas fa-user"></i></a>
            {user.username && <p>{user.username}</p>}
            {user.mod && <a href="/moderator">Moderator Area</a>}
        </div>
    </nav>
    )
}

