import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

const Search = () => {
    const [ filmFound, setFilmFound ] = useState([])

    var url = new URL(window.location.href);
    var search = url.searchParams.get("search");
    async function getMovie() {
        const data = await fetch("http://localhost:1234/api/search?search="+search, {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            setFilmFound(res.movie)
        } else {
            console.log('ERROR')
        }
    }

    useEffect(() => {
        getMovie()
    }, [])

    return(
        <div className="page_container">
            <Navbar/>
            <div className="content_search">
            <h1>Film trovati: </h1>
            <ul>{
                filmFound.length > 0 ?
            filmFound.map((key, i) => (
                <li key={key.title}><a href={"/film/"+`${key.title}`}>{key.title}</a></li>
            )): <p>No movie found!</p>
            }
            </ul>
            </div>
        </div>
    )
}
export default Search;