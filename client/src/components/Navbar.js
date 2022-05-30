import '../css/style.css'

export function Navbar() {

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
    </div>
</nav>
)}