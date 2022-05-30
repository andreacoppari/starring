import React, { useEffect, useState } from 'react'
import '../css/style.css'

export function Navbar() {
    const [ user, setUser ] = useState('')

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

    return(
    <nav>
        <div className="navbar_container">
            <a href="/homepage">STARRING</a>
            <div className="search-navbar_container">
                <form action="/search" method="get">
                    <input type="text" placeholder="Search" name="search" />
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

