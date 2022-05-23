import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { Navbar } from '../components/Navbar'


/*
import React, { useState, useEffect } from 'react'

export default function UsersData() {
  const [Users, fetchUsers] = useState([])

  const getData = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        fetchUsers(res)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <h2>React Fetch API Example</h2>
      <ul>
        {Users.map((item, i) => {
          return <li key={i}>{item.name}</li>
        })}
      </ul>
    </>
  )
}
*/

const Homepage = () => {
    const history = useHistory()
    const [ watchlist, setWatchlist ] = useState([])
    const [ recommended, setRecommended ] = useState([])
    const [ newFilm, setNewFilm ] = useState([])

    async function getRecommended() {
        const data = await fetch("http://localhost:1234/api/recommended", {
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
        const data = await fetch("http://localhost:1234/api/newfilm", {
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
    

    return (
        <div className='page_container'>
            <Navbar/>
            <div>
                <div className="header_list">
                    <div className="change_film">
                        <p><span><i className="fa fa-angle-left"></i></span></p>
                    </div>
                    <div className="change_film">
                        <p><span><i className="fa fa-angle-right"></i></span></p>
                    </div>
                </div>
                
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

                <div className="film_list">
                    <div className="film_list_title">
                        <h3>Watchlist</h3>
                    </div>
                    <div className="film_list_content">
                        {watchlist.map((item, i) => { 
                                return (
                                <a key={i} href={"/film"+`${item.title}`} title={item.title}><img src={item.cover}/></a>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Homepage