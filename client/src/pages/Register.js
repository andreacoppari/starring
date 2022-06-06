import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import "../css/signform.css"

function App() {
  const history = useHistory()

  const [ username, setUsername ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passwordR, setPasswordR ] = useState('')

  const usernameError = document.querySelector('.username_error')
  const emailError = document.querySelector('.email_error')
  const passwordError = document.querySelector('.password_error')
  const passwordRError = document.querySelector('.passwordR_error')

  //autenticazione con Google (passaggio 8)
  /*
  async function googleAuth(e) {
    const data = await fetch("/api/auth/google", {
      headers: {
        'Content-type': 'application/json',
      }
    })
    const res = await data.json()
    if (res.status === 'ok') {
      localStorage.setItem('token', data.token)
      window.location.href = "/homepage"
      alert("Login with Google successful!")
    }
    else{
      window.location.href = "/login"
      alert("Login with Google failed")
    }
  }
  */

  async function registerUser(event) {
    event.preventDefault()

    const response = await fetch(`https://starring-server.herokuapp.com/api/register`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordR,
      }),
    })
  
    const data = await response.json()
    if(data.errors){
      usernameError.textContent=data.errors.username
      emailError.textContent=data.errors.email
      passwordError.textContent=data.errors.password
      passwordRError.textContent=data.errors.passwordR
    }
    else{
      history.push('/login')
    }
  }

  //autenticazione con Google (passaggio 9)
  // in <div className="auth_google"> sostituire il campo: href="/auth/google" con: onClick={googleAuth}

  return (
    <div className='page_container'>
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
            <div className="username_error" ></div>
            <label htmlFor="email"><b>Email</b></label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="email"
            />
            <div className="email_error"></div>
            <label htmlFor="password"><b>Password</b></label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
            />
            <div className="password_error"></div>
            <label htmlFor="passwordR"><b>Confirm Password</b></label>
            <input
              value={passwordR}
              onChange={(e) => setPasswordR(e.target.value)}
              type="password"
              placeholder="password"
            />
            <div className="passwordR_error"></div>
            <label> <input type="checkbox" name="remember" style={{marginBottom: '15px'}}/> Ricordami</label>
            <a href="/login" style={{float: 'right', color: 'inherit'}} title="Accedi con il tuo account">Hai già un account?</a>
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
