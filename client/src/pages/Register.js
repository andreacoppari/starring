import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

function App() {
  const history = useHistory()

  const [ username, setUsername ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  async function registerUser(event) {
    event.preventDefault()

    const response = await fetch("http://localhost:1234/api/register", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
  
    const data = await response.json()
  
    if (data.status === 'ok') {
      history.push('/login')
    }
    else {
      alert("Email already in use")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="sign_container">
        <form onSubmit={registerUser}>
          <div className='form_content'>
            <h1>Registrati a Starring</h1>
            <div className="auth_google">
                  <a href="/auth/google" className="btn red darken-1"> <i className="fab fa-google left"></i> Login with Google</a>
                  <p>oppure</p>
            </div>
            <label htmlFor="username"><b>Username</b></label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="username"
            />
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
            <a href="/login" title="Accedi con il tuo account">Hai già un account?</a>
            <div className="clearfix">
                  <button type="submit" value="Register">Registrati</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
