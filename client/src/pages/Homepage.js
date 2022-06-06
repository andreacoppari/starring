import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

const Homepage = () => {
    const history = useHistory()
    const [ watchlist, setWatchlist ] = useState([])
    const [ recommended, setRecommended ] = useState([])
    const [ newFilm, setNewFilm ] = useState([])
    const [ headerDir, setHeaderDir] = useState(0)

    const token = localStorage.getItem('token')

    async function getRecommended() {
        const data = await fetch(`https://starring-server.herokuapp.com/api/recommended`, {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            setRecommended(res.movies)
        } else {
            console.log('ERROR')
        }
    }

    async function getNewFilm() {
        const data = await fetch(`https://starring-server.herokuapp.com/api/newfilm`, {
            headers: {
                'Content-type': 'application/json',
            }
        })
        const res = await data.json()
        if (res.status === 'ok') {
            setNewFilm(res.movies)
        } else {
            console.log('ERROR')
        }
    }

    useEffect(() => {
        getRecommended()
        getNewFilm()
    }, [])

    async function populateWatchlist() {
        const req = await fetch(`https://starring-server.herokuapp.com/api/watchlist`, {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })

        const data = await req.json()
        if (data.status === 'ok') {
            console.log(data.watchlist)
            setWatchlist(data.watchlist)
        }
    }
    
    useEffect(() => {
        console.log("test")
        if(token){
            const user = jwt.decode(token)
            console.log("user: "+user)
            if (!user) {
                localStorage.removeItem('token')
                history.replace('/login')
            } else {
                populateWatchlist()
            }
        }
    }, [])
    
    function moveHeader(direction) {
        if (headerDir === 0) {
            setHeaderDir(direction)
            setTimeout(() => setHeaderDir(0), 1000)
        }
    }

    return (
        <div className='page_container'>
            <Navbar/>
            <div>
                <div className={"header_list" + (headerDir !== 0 ? headerDir < 0 ? " header_moveleft" : " header_moveright" : '')}>
                    <div className="change_film">
                        <p onClick={e => moveHeader(-1)}><span><i className="fa fa-angle-left"></i></span></p>
                    </div>
                    <div className="change_film">
                        <p onClick={e => moveHeader(1)}><span><i className="fa fa-angle-right"></i></span></p>
                    </div>
                </div>
                {token && <div className="film_list">
                    <div className="film_list_title">
                        <h3>Watchlist</h3>
                    </div>
                    <div className="film_list_content">
                        {watchlist.map((item, i) => { 
                                return (
                                <a key={i} href={"/film/"+`${item.title}`} title={item.title}><img src={item.cover}/></a>
                                )
                            })}
                    </div>
                </div>}
                
                <div className="film_list">
                    <div className="film_list_title">
                        <h3>Recommended</h3>
                    </div>
                    <div className="film_list_content">
                        {recommended.map((item, i) => { 
                            return (
                            <a key={i} href={"/film/"+`${item.title}`} title={item.title}><img src={item.cover}/></a>
                            )
                        })}
                    </div>
                </div>

                <div className="film_list">
                    <div className="film_list_title">
                        <h3>New releases</h3>
                    </div>
                    <div className="film_list_content">
                        {newFilm.map((item, i) => { 
                                return (
                                <a key={i} href={"/film/"+`${item.title}`} title={item.title}><img src={item.cover}/></a>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Homepage