import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Homepage from './pages/Homepage'
import Film from './pages/Film'

const App = () => {
    return (
    <div>
        <BrowserRouter>
            <Route exact path="/">
                <Redirect to="/homepage"/>
            </Route>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/homepage" exact component={Homepage} />
            <Route path="/film/:id" exact component={Film} />
        </BrowserRouter>
    </div>
    )
}

export default App
