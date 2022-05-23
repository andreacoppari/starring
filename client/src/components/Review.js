import '../css/style.css'

export function Review(props) {
    return (
        <div className="comment">
            <p>{props.review}</p>
        </div>
    )
}

export default Review
