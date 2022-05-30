import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

function Moderator() {
    const [ reviews, setReviews ] = useState([])
    const [ selected, setSelected ] = useState(0)

    async function getReviews() {
        const data = await fetch("http://localhost:1234/api/reviews", {
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

    async function removeReviews(event) {
        event.preventDefault()

        const remove = []
        const leave = []
        reviews.forEach(review => (review.selected ? remove : leave).push(review));
        
        const req = await fetch('http://localhost:1234/api/removereviews', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify ({
                reviews: remove
            })
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setReviews(leave)
            setSelected(0)
        } else {
            alert(data.error)
        }
    }

    function selectReview(event, review) {
        review.selected = !(review.selected || false)
        review.selected ? setSelected(selected+1) : setSelected(selected-1)
        setReviews([...reviews])
    }

    function selectReviews(event) {
        event.preventDefault()

        var newSelected = selected
        const newReviews = []
        var str = document.forms['searchReview']['text'].value
        reviews.forEach(review => {
            if (!(review.selected || false)) {
                if (review.review.includes(str)) {
                    review.selected = true
                    newSelected++
                }
            }
            newReviews.push(review)
        });
        setReviews(newReviews)
        setSelected(newSelected)
    }

    return(
        <div className="page_container">
            <Navbar/>
            <div className="main_content">
                <div className="content_header">
                    <h1 id="film_title">All reviews</h1>
                    <p><span onClick={removeReviews} className="rating_span">Ban selected reviews {selected > 0 ? "("+selected+")" : ""}</span></p>
                </div>
                <div className="content_main">
                    <form name='searchReview' onSubmit={selectReviews}>
                        <input name='text' type="text" placeholder="Search contents"/>
                        <button type="submit">Select</button>
                    </form>
                </div>
                <div className="content_footer">
                    
                </div>
                <hr/>
                <div className="comment_container">
                    
                    <div className="comment_container_title" id="review_container">
                        <h2>User reviews</h2>
                        {reviews?.map((item) => { 
                                return(
                                <div onClick={e => selectReview(e, item)}
                                className={'comment' + (item.selected ? ' comment_selected' : ' comment_selectable')}
                                key={item._id}>

                                    <div className='comment_ban'>
                                        {item.selected ? "Unselect" : "Select"}
                                    </div>
                                    <div className='comment_title'>
                                        <h4>{item.user} {item.email}</h4>
                                    </div>
                                    <div className='comment_user'>
                                        <p>{item.movie}</p>
                                    </div>
                                    <div className="comment_text">
                                        <div className='comment_title'>
                                            <p>{item.review}</p>
                                        </div>
                                    </div>
                                </div>
                                )
                            })}
                    </div>
                    
                </div>
                <br/>
            </div>
        </div>
    )
}

export default Moderator