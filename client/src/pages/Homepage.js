import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

const Homepage = () => {
    const history = useHistory()
    const [ watchlist, setWatchlist ] = useState('')
    const [ movieToAdd, setMovieToAdd ] = useState('')

    async function populateWatchlist() {
        const req = await fetch('http://localhost:1234/api/watchlist', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })

        const data = req.json()
        if (data.status === 'ok') {
            setWatchlist(data.watchlist)
        } else {
            alert(data.error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if (!user) {
                localStorage.removeItem('token')
                history.replace('/login')
            }
            else {
                populateWatchlist()
            }
        }
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
                watchlist: movieToAdd
            })
        })

        const data = await req.json()
        console.log(data)
        if (data.status === 'ok') {
            setMovieToAdd('')
            setWatchlist(data.watchlist)
        } else {
            alert(data.error)
        }
    }

    return (
        <div>
            <Navbar/>
            <h1>
                Starring Homepage
            </h1>
            <h2>Watchlist: {watchlist}</h2>
            <form onSubmit={updateWatchlist}>
				<input
					type="text"
					placeholder="Add to watchlist"
					value={movieToAdd}
					onChange={(e) => setMovieToAdd(e.target.value)}
				/>
				<input type="submit" value="Update watchlist" />
			</form>
        </div>
    )
}

export default Homepage