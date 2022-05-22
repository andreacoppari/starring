import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import "../css/signform.css"

function App() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  async function loginUser(event) {
    event.preventDefault()

    const response = await fetch("http://localhost:1234/api/login", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
  
    const data = await response.json()
  
    if (data.user) {
      localStorage.setItem('token', data.user)
      alert('Login successful')
      window.location.href = "/homepage"
    } else {
      alert('Login failed. Please check your username and password')
    }
  }

  return (
    <div className="page_container">
      <Navbar />
      <div className="sign_container">
        <form onSubmit={loginUser}>
          <div className='form_content'>
            <h1>Accedi al tuo account</h1>
            <div className="auth_google">
                  <a href="/auth/google" className="btn red darken-1"> <i className="fab fa-google left"></i> Login with Google</a>
                  <p>oppure</p>
            </div>
            <label htmlFor="email"><b>Email</b></label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="email"
            />
            <label htmlFor="password"><b>Password</b></label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
            />
            <label> <input type="checkbox" name="remember" style={{marginBottom: '15px'}}/> Ricordami</label>
            <a href="/register" style={{float: 'right', color: 'inherit'}} title="Crea un account">Non hai un account?</a>
            <div className="clearfix">
                  <button type="submit" value="Login">Accedi</button>
            </div>
          </div>
        </form>
      </div>
      </div>
  );
}

export default App;
