import '../css/style.css'
import { GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'

export function Navbar() {

const googleLogout = () => {
    alert("Logout successful!")
}

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
        <GoogleLogout
            clientId='426974248841-ef5qifroecnne6pq55mgs88f9j6tr112.apps.googleusercontent.com'
            buttonText='Logout'
            onLogoutSuccess={googleLogout}
        />
    </div>
</nav>
)}
