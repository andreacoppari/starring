import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

const Search = () => {
    const [ filmFound, setFilmFound ] = useState([])

    function sortMovies(search, movies) {
        const inizia = []
        const contiene_inizia = []
        const contiene = []
        const exp = new RegExp(search, "i")
        var index = 0
        movies.forEach(m => {
            index = m.title.search(exp)
            if (index === 0) inizia.push(m)
            else if (m.title[index-1] === ' ') contiene_inizia.push(m)
            else contiene.push(m)
        });
        return inizia.concat(contiene_inizia, contiene)
    }

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
            setFilmFound(sortMovies(search, res.movie))
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
            filmFound.map((key) => (
                <li key={key._id}><a href={"/film/"+key.title}>{key.title}</a></li>
            )): <p>No movie found!</p>
            }
            </ul>
            </div>
        </div>
    )
}
export default Search;