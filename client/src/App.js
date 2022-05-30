import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Homepage from './pages/Homepage'
import Film from './pages/Film'
import Search from './pages/Search'
import Moderator from './pages/Mod'

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
            <Route path="/search" exact component={Search} />
            <Route path="/moderator" exact component={Moderator} />
        </BrowserRouter>
    </div>
    )
}

export default App
