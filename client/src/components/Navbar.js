import '../css/style.css'

export function Navbar() {

    async function search() {
        const data = await fetch("http://localhost:1234/api/search", {
            headers: {
                'Content-type': 'application/json',
            }
        })
    }

return(
<nav>
    <div className="navbar_container">
        <a href="/homepage">STARRING</a>
        <div className="search-navbar_container">
            <form action="#" method="get">
                <input type="text" placeholder="Search" name="search" />
                <button type="submit" onClick="search()"><i className="fa fa-search"></i></button>
            </form>
            </div>
        <a href="/login"><i className="fas fa-user"></i></a>
    </div>
</nav>
)}
