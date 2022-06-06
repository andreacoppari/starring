import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'

function Moderator() {
    const [ reviews, setReviews ] = useState([])
    const [ selected, setSelected ] = useState(0)

    async function getReviews() {
        const data = await fetch(`https://starring-server.herokuapp.com/api/reviews`, {
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            }
        })
        
        const res = await data.json()
        
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
        
        const req = await fetch(`https://starring-server.herokuapp.com/api/removereviews`, {
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

    async function selectReview(event, review) {
        review.selected = !(review.selected || false)
        review.selected ? setSelected(selected+1) : setSelected(selected-1)
        setReviews([...reviews])
    }

    async function selectReviews(select) {
        var newSelected = selected
        const newReviews = []
        const str = document.forms['searchReview']['text'].value
        const exp = new RegExp(str, "i")
        
        reviews.forEach(review => {
            if ((review.selected || false) !== select) {
                if (exp.test(review.review)) {
                    review.selected = select
                    select? newSelected++ : newSelected--
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
                    <form name='searchReview'>
                        <input name='text' type="text" placeholder="Search text"/>
                        <button type="button" onClick={e => selectReviews(true)}>Select</button>
                        <button type="button" onClick={e => selectReviews(false)}>Unselect</button>
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
                                    <div className='comment_head'>
                                        <div>
                                            <div className='comment_title'>
                                                <h4>{item.movie}</h4>
                                            </div>
                                            <div className='comment_user'>
                                                <p><i>{item.user} {new Date(item.createdAt).toLocaleDateString()}</i></p>
                                            </div>
                                        </div>
                                        <div className='comment_ban'>
                                            <u>{item.selected ? "unselect" : "select"}</u>
                                        </div>
                                    </div>
                                    <p>{item.review}</p>
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