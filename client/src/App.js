import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Homepage from './pages/Homepage'

const App = () => {
    return (
    <div>
        <BrowserRouter>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/homepage" exact component={Homepage} />
        </BrowserRouter>
    </div>
    )
}

export default App
