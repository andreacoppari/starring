import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

function Moderator() {
    const [ reviews, setReviews ] = useState('')

    async function getReviews() {
        const data = await fetch("http://localhost:1234/api/user-review", {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        })
        
        const res = await data.json()
        console.log(res)
        if (res.status === 'ok') {
            setReviews(res.reviews)
        } else {
            console.log('ERROR')
        }
    }

    useEffect(() => {
        getReviews()
    }, [])

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
            getReviews()
        } else {
            alert(data.error)
        }
    }

    return(
        <div className="page_container">
            <Navbar/>
            <div className="main_content">
                <div className="content_header">
                    <h1 id="film_title">All reviews</h1>
                    <p><span className="rating_span">Ban selected reviews</span></p>
                </div>
                <div className="content_main">
                    
                </div>
                <div className="content_footer">
                    
                </div>
                <hr/>
                <div className="comment_container">
                    
                    <div className="comment_container_title" id="review_container">
                        <h2>User reviews</h2>
                        {/**reviews?.map((item, i) => { 
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
                            })*/}
                    </div>
                    
                </div>
                <br/>
            </div>
        </div>
    )
}

export default Moderator