import React, { useEffect, useState } from 'react'
import '../css/style.css'

export function Navbar() {
    const [ user, setUser ] = useState('')
    const [ filmFound, setFilmFound ] = useState([])
    const [ showSearch, setShowSearch] = useState(false)
    const [ searchMovie, setSearchMovie] = useState(null)
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

    function sortMovies(search, movies) {
        const inizia = []
        const contiene_inizia = []
        const contiene = []
        const exp = new RegExp(search, "i")
        var index = 0
        movies.forEach(m => {
            index = m.title.search(exp)
            if (index == 0) inizia.push(m)
            else if (m.title[index-1] == ' ') contiene_inizia.push(m)
            else contiene.push(m)
        });
        return inizia.concat(contiene_inizia, contiene)
    }

    async function getMovie(target) {
        const search = target.value
        setSearchMovie(search)
        
        const data = await fetch("http://localhost:1234/api/search?search="+search, {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        
        if (search != target.value) return
        if (res.status === 'ok') {
            setFilmFound(sortMovies(search, res.movie))
        } else {
            setFilmFound([])
            console.log('ERROR')
        }
        setSearchMovie(search ? "" : null)
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
                        <input type="text" placeholder="Search" name="search" onChange={e => getMovie(e.target)}/>

                        {showSearch && searchMovie !== null &&
                            <div className='autocomplete-items'>
                                {searchMovie ? <p>Searching...</p> : filmFound.length == 0 && <p>No movie found!</p> }
                                {
                                filmFound.slice(0,3).map((film) => (
                                        <div key={film._id}>
                                            <a href={"/film/"+film.title}>{film.title}</a>
                                        </div>
                                    ))
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

