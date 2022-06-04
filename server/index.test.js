const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = require('./index')

const secret = '911284b06459b85fb9d285183b10de52f16a871f83f2a174a230297106ab264c6467a97503cad712e5f6c81268bc5cb3773b92af74eb371999e23c1f823eb8cf'
const token = jwt.sign({
    username: "mod",
    email: "mod@mod.it",
    mod: 1
}, secret)
const testToken = jwt.sign({
    username: "test",
    email: "test@google.com",
    mod: 0
}, secret)

test('index module should be defined', () => {
    expect(app).toBeDefined();
});
// Testing api/register
test('POST /api/register without username', async () => {
    return request(app)
    .post('/api/register')
    .send({
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "test@test.com",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"An username is required","email":"","password":"","passwordR":"","message":"unknown"}})
            //console.log(res.body)
    })
})
test('POST /api/register with too short username', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Te",
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "test@test.com",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"The username must be at least 3 characters long","email":"","password":"","passwordR":"","message":"unknown"}})
            //console.log(res.body)
    })
})
test('POST /api/register with too long username', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "TesterTesterTesterTesterTester",
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "test@test.com",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"The username must be a maximum of 24 characters long","email":"","password":"","passwordR":"","message":"unknown"}})
            //console.log(res.body)
    })
})
test('POST /api/register without email', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        passwordR: "Testpassword1",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"An email is required","password":"","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/register with email already in use', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "mod@mod.it",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"This email is already registered","password":"","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/register with non valid email', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "mod",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"This email is invalid","password":"","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/register with too long email', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "modmodmodmodmodmodmod@mod.it",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"The email must be a maximum of 24 characters long","password":"","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/register without repeating password', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        email: "test@test.com",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"","passwordR":"The passwords must be the same","message":"unknown"}})
    })
})
test('POST /api/register without repeating password', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        passwordR: "Testpassword1",
        email: "test@test.com",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"","passwordR":"The passwords must be the same","message":"unknown"}})
    })
})
test('POST /api/register with password and password repeat different', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        passwordR: "Testpassword2",
        email: "test@test.com",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"","passwordR":"The passwords must be the same","message":"unknown"}})
    })
})
test('POST /api/register with non valid password: no uppercase letters', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "testpassword1",
        passwordR: "testpassword1",
        email: "mod@mod.it",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"Password must contain at least one number, one lowercase and one uppercase letter","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/register with non valid password: no lowercase letters', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "TESTPASSWORD1",
        passwordR: "TESTPASSWORD1",
        email: "mod@mod.it",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"Password must contain at least one number, one lowercase and one uppercase letter","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/register with non valid password: no numbers', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword",
        passwordR: "Testpassword",
        email: "mod@mod.it",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"Password must contain at least one number, one lowercase and one uppercase letter","passwordR":"","message":"unknown"}})
    })
})

test('POST /api/login with unregistered email', async () => {
    return request(app)
    .post('/api/login')
    .send({
        email: "mod",
        password: "Testpassword",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"Invalid mail","password":"","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/login with wrong password', async () => {
    return request(app)
    .post('/api/login')
    .send({
        email: "mod@mod.it",
        password: "Testpassword",
      })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"errors":{"username":"","email":"","password":"Wrong password","passwordR":"","message":"unknown"}})
    })
})
test('POST /api/login with success', async () => {
    return request(app)
    .post('/api/login')
    .send({
        email: "mod@mod.it",
        password: "Moderatore0",
      })
    .then((res) => {
        if(res.body){
            expect(res.body.status).toEqual('ok')
        }     
    })
})

// Testing api/user
test('GET /api/user without token in header should return error message because no token defined', async () => {
    return request(app)
    .get('/api/user')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"error","error":"invalid token"})
    })
})
test('GET /api/user with token in header should return user information', async () => {
    return request(app)
    .get('/api/user')
    .set('x-access-token', token)
    .expect(200)
    .then((res) => {
        if(res.body){
            const decoded = jwt.verify(token, secret)
            expect(res.body).toEqual({"status":'ok', "user": { "username": 'mod', "email": 'mod@mod.it', "mod": 1, "iat":decoded.iat}})
        }      
    })
})

// Testing recommended api
test('GET /api/recommended should return a list of films based on starring-rating', async () => {
    return request(app)
    .get('/api/recommended')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"ok","movies":[{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b93578b","title":"The Lion King","cover":"https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX101_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357a1","title":"Aliens","cover":"https://m.media-amazon.com/images/M/MV5BZGU2OGY5ZTYtMWNhYy00NjZiLWI0NjUtZmNhY2JhNDRmODU3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX101_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935770","title":"The Godfather","cover":"https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY150_CR2,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935776","title":"Pulp Fiction","cover":"https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY150_CR1,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935771","title":"The Dark Knight","cover":"https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935780","title":"It's a Wonderful Life","cover":"https://m.media-amazon.com/images/M/MV5BZjc4NDZhZWMtNGEzYS00ZWU2LThlM2ItNTA0YzQ0OTExMTE2XkEyXkFqcGdeQXVyNjUwMzI2NzU@._V1_SY150_CR1,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935777","title":"The Lord of the Rings: The Fellowship of the Ring","cover":"https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935818","title":"Ratatouille","cover":"https://m.media-amazon.com/images/M/MV5BMTMzODU0NTkxMF5BMl5BanBnXkFtZTcwMjQ4MzMzMw@@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935787","title":"Back to the Future","cover":"https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX101_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357e8","title":"V for Vendetta","cover":"https://m.media-amazon.com/images/M/MV5BOTI5ODc3NzExNV5BMl5BanBnXkFtZTcwNzYxNzQzMw@@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357a8","title":"Toy Story","cover":"https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX101_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b93581f","title":"Hachi: A Dog's Tale","cover":"https://m.media-amazon.com/images/M/MV5BNzE4NDg5OWMtMzg3NC00ZDRjLTllMDMtZTRjNWZmNjBmMGZlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY150_CR2,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935810","title":"Ford v Ferrari","cover":"https://m.media-amazon.com/images/M/MV5BM2UwMDVmMDItM2I2Yi00NGZmLTk4ZTUtY2JjNTQ3OGQ5ZjM2XkEyXkFqcGdeQXVyMTA1OTYzOTUx._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b93577c","title":"The Matrix","cover":"https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX101_CR0,0,101,150_.jpg"}]})
    })
})

// Testing newFilm api
test('GET /api/newfilm should return list of films based on release date', async () => {
    return request(app)
    .get('/api/newfilm')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"ok","movies":[{"_id":"6287a44ed9c12de99b935798","title":"Everything Everywhere All at Once","cover":"https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_SY150_CR1,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357c1","title":"Spider-Man: No Way Home","cover":"https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935810","title":"Ford v Ferrari","cover":"https://m.media-amazon.com/images/M/MV5BM2UwMDVmMDItM2I2Yi00NGZmLTk4ZTUtY2JjNTQ3OGQ5ZjM2XkEyXkFqcGdeQXVyMTA1OTYzOTUx._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357bc","title":"Come and See","cover":"https://m.media-amazon.com/images/M/MV5BOGM3ZDlkYjEtNzVjYi00ZGU2LWJmY2YtYjhjYWZmNDE5NDMyXkEyXkFqcGdeQXVyMjMxNTgwMDA@._V1_SY150_CR2,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357ac","title":"Avengers: Endgame","cover":"https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357a4","title":"Spider-Man: Into the Spider-Verse","cover":"https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357d3","title":"Green Book","cover":"https://m.media-amazon.com/images/M/MV5BYzIzYmJlYTYtNGNiYy00N2EwLTk4ZjItMGYyZTJiOTVkM2RlXkEyXkFqcGdeQXVyODY1NDk1NjE@._V1_SX101_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357a0","title":"Avengers: Infinity War","cover":"https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357ee","title":"Three Billboards Outside Ebbing, Missouri","cover":"https://m.media-amazon.com/images/M/MV5BMjI0ODcxNzM1N15BMl5BanBnXkFtZTgwMzIwMTEwNDI@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357cf","title":"Dangal","cover":"https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SY150_CR3,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935806","title":"Hacksaw Ridge","cover":"https://m.media-amazon.com/images/M/MV5BMjQ1NjM3MTUxNV5BMl5BanBnXkFtZTgwMDc5MTY5OTE@._V1_SX101_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935809","title":"Mad Max: Fury Road","cover":"https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b935800","title":"The Grand Budapest Hotel","cover":"https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357fb","title":"Gone Girl","cover":"https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_SY150_CR0,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357fa","title":"12 Years a Slave","cover":"https://m.media-amazon.com/images/M/MV5BMjExMTEzODkyN15BMl5BanBnXkFtZTcwNTU4NTc4OQ@@._V1_SY150_CR0,0,101,150_.jpg"}]})
    })
})
// Testing search api
test('GET /api/search?search=Joker should return information about film Joker', async () => {
    return request(app)
    .get('/api/search')
    .query({
        search: "Joker",
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"ok","movie":[{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","year":1991,"rating":4.6,"Starring rating":10,"genres":["Comedy","Crime"],"cast":["Björn Skifs","Aja Rodas-Evrén","Johan Ulveson","Marie-Chantal Long","Jacob Nordenson","Catherine Hansson","Gert Fylking","Johan Paulsen","P.G. Hylén","Björn Kjellman","Ragnar Ulfung","Peter Panov","Assen Panov","Lars Engström","Arne Rubensson","Fredrik Dolk","Hans Kellerman","Peter Ahlm","Hans Saxinger","Maud Höglund","Anders Esphagen","Margareta Pettersson","Claes Ljungmark","Ali Alibhai","Ann Canvert","Aldi Foddis","Hans O. Sjöberg","Dick Olsson","Victor Kritz-Hedqvist","Pontus Bjuring-Gerlich","Rinkeby Kids","Eric Bibb","Astors 'Pelle' Bellsybus","Lennart Järnstad"],"reviews":["This is Joker seemingly it is the swedish orginal which the joker reboot from 2019 have taken inspiration from. This is one of the best and well executed films in all time and of course they have Björn skifs in the role as Nicke the version of Joker in this universe. This is basically Joker hunted by the italian mafia while fighting nazis","This is a movie that only those who have felt alone and isolated can truly relate to it. You understand the motive and you feel sorry for the character. A lot of people will see this movie and think that it encourages violence. But truly, this movie should encourage each and every one of us to become a better person, treat everyone with respect and make each other feel like they belong in this world, instead of making them feel isolated.","I give him 10 on 10000000000999999999999999 ^9999"],"cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"}]})
    })
})

test('GET /api/search?search=Jo should return information about film which have Jo inside title', async () => {
    return request(app)
    .get('/api/search')
    .query({
        search: "Jo",
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"ok","movie":[{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","year":1991,"rating":4.6,"Starring rating":10,"genres":["Comedy","Crime"],"cast":["Björn Skifs","Aja Rodas-Evrén","Johan Ulveson","Marie-Chantal Long","Jacob Nordenson","Catherine Hansson","Gert Fylking","Johan Paulsen","P.G. Hylén","Björn Kjellman","Ragnar Ulfung","Peter Panov","Assen Panov","Lars Engström","Arne Rubensson","Fredrik Dolk","Hans Kellerman","Peter Ahlm","Hans Saxinger","Maud Höglund","Anders Esphagen","Margareta Pettersson","Claes Ljungmark","Ali Alibhai","Ann Canvert","Aldi Foddis","Hans O. Sjöberg","Dick Olsson","Victor Kritz-Hedqvist","Pontus Bjuring-Gerlich","Rinkeby Kids","Eric Bibb","Astors 'Pelle' Bellsybus","Lennart Järnstad"],"reviews":["This is Joker seemingly it is the swedish orginal which the joker reboot from 2019 have taken inspiration from. This is one of the best and well executed films in all time and of course they have Björn skifs in the role as Nicke the version of Joker in this universe. This is basically Joker hunted by the italian mafia while fighting nazis","This is a movie that only those who have felt alone and isolated can truly relate to it. You understand the motive and you feel sorry for the character. A lot of people will see this movie and think that it encourages violence. But truly, this movie should encourage each and every one of us to become a better person, treat everyone with respect and make each other feel like they belong in this world, instead of making them feel isolated.","I give him 10 on 10000000000999999999999999 ^9999"],"cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"},{"_id":"6287a44ed9c12de99b9357cd","title":"Indiana Jones and the Last Crusade","year":1989,"rating":8.2,"Starring rating":7.91,"genres":["Action","Adventure"],"cast":["Harrison Ford","Sean Connery","Denholm Elliott","Alison Doody","John Rhys-Davies","Julian Glover","River Phoenix","Michael Byrne","Kevork Malikyan","Robert Eddison","Richard Young","Alexei Sayle","Alex Hyde-White","Paul Maxwell","Isla Blair","Vernon Dobtcheff","J.J. Hardy","Bradley Gregg","Jeff O'Haco","Vince Deadrick Sr.","Marc Miles","Ted Grossman","Tim Hiser","Larry Sanders","Will Miles","David Murray","Frederick Jaeger","Jerry Harte","Billy J. Mitchell","Martin Gordon","Paul Humpoletz","Tom Branch","Graeme Crowther","Luke Hanson","Chris Jenkinson","Nicola Scott","Louis Sheldon","Stefan Kalipha","Peter Pacey","Pat Roach","Suzanne Roquette","Eugene Lipinski","George Malpas","Julie Eccles","Nina Armstrong","Vic Armstrong","Roy Beck","Dickey Beer","Peter Diamond","Hugh Elton","Albert Evansky","Nick Gillard","Martin Grace","Paul Heasman","Ronald Lacey","Derek Lyons","Paul Markham","Wayne Michaels","Lee Richards","Michael Sheard","Tip Tipping","Chris Webb"],"reviews":["Indiana Jones and the Last Crusade (1989) is an Action Classic adventure better film than Temple of Doom , is still the best follow up in the trilogy and clever. It is also the greatest sequel of all time. It is one of my personal favorite adventure movies of all time. I love this movie to death. I loved it as a child and I still love it. After the dark middle chapter it was time for Indy to return to form and more lighthearted fair. Indiana Jones and the Last Crusade was the answer. Not to mention that bringing in Bond aka Sean Connery as Indy's dad was perfect casting. Connery adds his own whit & charm along with Indy's usual counterparts who where missed in The Temple of Doom. Last Crusade also bookends the trilogy well since the artifact he is after is related to God. While \"Indiana Jones and the Last Crusade\" isn't by any means what I would consider a stellar film, it was still an enjoyable and memorable theatrical experience, and in my opinion, easily ranks as the best sequel in the series. For all its faults and shortcomings (perhaps most of all, River Phoenix' laughably terrible haircut as the young Indy), the film succeeds in hitting the key notes at the proper moments, thus drumming up enough of the right combination of story and thematic elements, action and humor to make it worthwhile. Nevertheless, the bottom line is that it still pales in comparison to the level of across-the-board excellence that was achieved in the original 1981 movie. Still though, fans of this one will definitely want to pick up this excellent release, of which, throughout the entire presentation, I only came across a handful of things I thought could possibly be improved upon technically.This is probably the best installment of the Indiana Jones series. Raiders is a spectacular introduction to Dr. Jones and his style, Temple of Doom is an awesome Action, Adventure flick! Last Crusade rights the ship again with a go-for-broke production. Everything about it is huge- Jones is saving the planet from the Nazis for the second time. The budget was in place and off went Spielberg to make an epic, successfully. The film is bookended by two of the best things to appear in any of Spielberg's output: A young Indiana \"beginning\" his archaeological career, losing his treasure- just like the opening of Raiders- and being told by the man in his trademark hat \"You lost today kid, but that doesn't mean you have to like it.\" and at the end, riding off into the sunset, literally. Such a conclusion could be seen as contrived but it works so well here. Indiana Jones and the Last Crusade has lots of hand-to-hand combat, action-filled chases, and gun fights. Main characters are in near-constant peril, and one is shot point blank and almost bleeds to death. Minor characters are killed in somewhat gruesome ways, including beheading; a bad guy meets his end in a fairly disturbing scene. There's a bit of kissing/banter, and it's implied that two men have slept with the same woman. Language is mild, and there's ultimately a strong message about the importance of the father-son relationship.Indiana Jones and the Last Crusade is a 1989 American adventure film directed by Steven Spielberg, from a story co-written by executive producer George Lucas. It is the third installment in the Indiana Jones franchise. A cult film, still one of my favorite films in the series and the last good Indiana Jones movie we didn't need another sequel after third release. There's nothing more exciting than trying to keep up with the Joneses in Indiana Jones and the Last Crusade. Indy's Nazi enemies are back and have kidnapped his father, Professor Henry Jones Sr. (Sean Connery), in their effort to locate the sacred Holy Grail. Following a trail from America to Venice to the deserts of the Middle East, it's up to Indy (Harrison Ford) to save his father, save the Grail and save the day in this non-stop, action-packed adventure the whole family will treasure.The chemistry between Sean Connery and Harrison Ford makes this movie a stand out from the rest of the series. The story of their father and son relationship wrapped in the search for the holy grail is what makes this spectacular Indy movie, a more meaningful adventure. 10/10 Bad Ass Seal Of Approval","So how do you return a franchise to it's successful past? Apparently bring back most of the cast from the first movie and the Nazis but add Sean Connery. This movie is as good if not even just a little bit better than the original. The interaction between Ford and Connery is amazing and makes for an enjoyable film. The action and story in this is great. This time (back to looking for Christian artifacts) Indy is out to find his father who went missing while looking for the Holy Grail.","Indiana Jones, the man, the legend, the whip. Everyone I know has seen at least one of the Indiana Jones movies and usually Raiders of the Lost Ark is their favorite. Now I loved Raiders of the Lost Ark, I also really loved Temple of Doom even though it gets a lot of hate for it's darkness. But The Last Crusade is my favorite of the trilogy and the strongest in my opinion. For goodness's sake we have Sean Connery as Indiana's father, how could we get any better than that? I love his way of saying \"Junior!\", always gets me in a good chuckle. Harrison Ford still has that same Indy charm that swoons the ladies, the adventure that captivates the guys and takes us on an incredible journey that we'll never forget.In 1938, Indiana finally recovers the Cross and donates it to his friend Marcus Brody's museum. Indiana is later taken to the residence of wealthy businessman Walter Donovan, who informs him that his father has vanished while searching for the Holy Grail, leaving behind partial directions from an incomplete stone tablet along with his diary containing his life's work on the Grail. Indiana and Marcus travel to Venice to investigate Henry's disappearance, meeting up with his colleague Elsa Schneider. Discovering catacombs beneath the library where Henry was last seen, Indiana and Elsa find the tomb of Sir Richard, a knight of the First Crusade who is buried with a complete version of the tablet. Indiana finds his father, only to be betrayed by Elsa, who reveals that she and Donovan are working with the Nazis to find the Grail. The Nazis steal the Grail diary and capture Marcus in Iskenderun, where he was sent with pages from the diary to seek the protection of Sallah. The Joneses manage to escape the castle and follow the Nazis to Berlin, where they recover the diary from Elsa. The Joneses, Marcus and Sallah arrive to find that the Nazis are unable to pass through three \"trials\" of God. After Indy's father gets shot, he doesn't have much of a choice as to pass the trials and choose the correct cup to save his father's life.Indiana Jones and the Last Crusade is one of my favorite movies of all time, it's just a flawless movie that will always be timeless. My future kids will watch these movies, they're just a lot of fun. Who said archeology can't be fun? This also has one of the most exciting chase scenes of all time, Indiana is trying to rescue his father and a friend from a Nazi tank and he is on a horse, a brutal fight ensues and was just so exciting to watch. I've watched this movie since I was a little girl and I still watch it with pleasure today, even with my friends we love watching Indiana and his adventures. They're an absolute blast and if you haven't seen Indiana Jones and the Last Crusade, please take the first opportunity you have to watch it, it's a great movie.10/10","Indiana Jones teams up with his father to try and locate the Holy Grail. Something that the Nazis are again particularly interested in themselves.We didn't know it at the time, but every Indiana Jones fan on the planet presumed that The Last Crusade was to be the final film to feature the intrepid archaeologist. As it turned out, another film would surface in 2008, but casting that aside (as many would like to do), Last Crusade should, and is, judged as the trilogy closer it was meant to be.In 1988 Steven Spielberg was deep into bringing Rain Man to fruition, all thoughts of Indiana Jones had gone by the wayside with the harshly judged part two, Temple Of Doom. In stepped George Lucas to politely remind Spielberg that they had an agreement to make another Indiana Jones picture, Spielberg no doubt obliged and humble, passed on his Rain Man work to Barry Levinson who promptly bagged himself an Oscar for the film. It can be guessed that Spielberg was probably grouchy around this period, but he needn't have worried, because The Last Crusade provided a much needed hit for not only himself (post Empire Of The Sun), but also Lucas (Willow) and Harrison Ford (Frantic).I mention the run up to this picture because it explains a lot on why the film is pretty much a retread of Raiders Of The Lost Ark, something that some detractors find unforgivable. Yet Last Crusade is still an immensely enjoyable adventure picture, with Spielberg proving that he was still capable of a popcorn bonanza. Using the Raiders formula and moving away from the dark flourishes of Temple Of Doom, Last Crusade is actually the simplest film of the three, but still it manages, courtesy of a sparkling casting decision, to become the most entertaining of the original trilogy. Is it better than Raiders? Of course not, but it positively rips along with sparky dialogue and an agenda of cliffhanging suspense like the adventure films of yore.In comes Sean Connery as Dr Jones Senior, and its the picture's trump card, because the magnificent interplay and obvious rapport with Ford (cool as a cucumber) is there for all to see. It's this what drives the film on through the more mundane and picture filler sequences, showcasing two top wily professionals with care and consideration to their craft. The casting of Alison Doody as the main female is a poor one, and one only has to look at her subsequent career post Crusade to see she wasn't up to the task here. Bonus comes in the form of the River Phoenix prologue, Phoenix as the young Indiana paves the way for the jaunty path that Crusade takes, whilst simultaneously giving us a nice little back story from which to launch the adventure.Made for $48 million, the film went on to gross $474,171,806 Worldwide, now that's a lot of people who evidently were happy with Raiders Of The Lost Ark 2! And I gleefully count myself amongst that number. 9/10","One thing you gotta say for this series: it isn't boring.And \"Last Crusade\" has enough thrills, chills and spills to fill up a few dozen old Saturday afternoon serials. Right down the line, everything about this film is superb. Ford and Connery do the father and son routine superbly. Rhys-Davies returns as Sallah, as does Elliott who plays Brody with as much befuddlement as Connery does his role. And who can blame him? And the FX: there's so many you lose count. But don't bother, just sit back, relax and get swept up in the moment. You can't help yourself but to get into this \"Crusade\".Ten stars. A classic Ford with a bright Sean.","Rating: **** out of ****My opinion of Indiana Jones and the Last Crusade could be deemed slightly biased. It is the first film I ever saw in theaters and it's also the first movie I purchased on video. I even own the same, worn-down, beat-up copy (and look upon it even more fondly than the widescreen edition, for sentimental reasons, of course) (but nothing beats the pristine quality DVD). I think it's fair to say it's this movie that cemented my love of cinema, the high regard I hold for great escapism, which is sorely lacking from today's cinema; movies that should be fun now drag or bludgeon themselves with relentlessly awful scripts or MTV-style direction that turns relatively simple scenes into chaotic blurs. The Last Crusade may only be thirteen years old, but I think I can safely say they don't make them like they used to.The film stars, of course, Harrison Ford as Indy Jones, the archaeologist/adventurer who's on yet another quest, this time to find his father, who'd been searching for the Holy Grail. Said Dad is played by none other than Sean Connery, whose highly charismatic performance is quick to place this film, acting-wise, above the others in the trilogy by giving Ford a genuine acting equal (let me put it this way, he's only half a notch below Harrison Ford/Indy in charisma and appeal if that tells you anything). The rest of the film focuses on this ongoing journey between father and son (eventually joined along by Sallah and Marcus Brody), complete with amazing action and stunt sequences, clever humor, and nasty (but fun) surprises.The script, by Jeffrey Boam, takes a few cues from Raiders of the Lost Ark, but actually improves upon that story by paying more attention to characterization. The delightful opening scene (all three movies really open with a bang, don't they?); which details how young Indy got his scar, whip, hat, and fear of snakes; makes for a better prequel than Temple of Doom (and any of The Adventure of Young Indiana Jones, for that matter).The story is engrossing because there's a lot of fun clues offered towards the location of the Grail and, thus, there's a lot of engaging little discoveries (love the \"X marks the spot\" scene). I'm quite certain, like with Raiders of the Lost Ark, the plot has a few holes, but they're fairly hard to notice, and I've seen this movie quite a few times, but maybe it's just my enjoyment of the film clouding that up. Either way, it speaks volumes in favor of Spielberg's direction and the performances.Given that action and adventure is the series' selling point, you can expect the thrills and wondrous delight of discovery delivered in spades. The action scenes are terrific (and matched well with John Williams' rousing, memorable score, also the best of the trilogy), the best being a fantastic ten-minute chase sequence on board (and in) a tank, possibly the best action sequence of Spielberg's career. I also loved the motorcycle chase and the Zeppelin setpiece, where the heroes go about dispatching of two enemy fighters in unexpected, but quite hilarious, fashion. The climax, complete with frightening booby traps, is a suspenseful venture into the unknown.The Last Crusade is far more humor-oriented than its predecessors, but part of the movie's effectiveness is that it's able to deliver belly laughs without defusing the tension during the action sequences. Some of the jokes are just brilliant, including one with Indy armed with a Luger in confrontation with a trio of Nazis on board a tank that's even funnier than the swordsman scene in Raiders (well, to me, at least).The supporting cast is all-around superb; John Rhys-Davies is back as Sallah, wonderful as ever and displaying a bit more enthusiasm searching for the Grail than he did digging up the Ark of the Covenant. The late Denholm Elliot also returns as Marcus Brody, the most lovable goof of a museum curator. Alison Doody is interesting as Elsa, the blonde historian whom Indy falls for; a twist involving her character and her actions towards the climax make her not as one-dimensional as she may initially appear. Julian Glover is the best of the main Indy villains, he's far more menacing than Paul Freeman's Belloq and less over-the-top but equally enjoyable as Amrish Pruri's Mola Ram. I also enjoyed Michael Byrne's performance as the Jones hating Colonel Vogel, who relishes in torturing Indy and his father. When it comes to pure delightfully nasty villainy, Byrne is even more fun to watch than Glover.Harrison Ford delivers his best Indy performance (maybe even his best performance, period) in this particular adventure. With the addition of Connery as his father, it reveals a personal side to Indy we haven't seen before. It's his rapport with Connery that separates this film from the rest of the genre. They craft an uncannily touching, funny, and genuine bond. That, coupled with the superb action and thrills, solidifies The Last Crusade as the pinnacle of high adventure summer entertainment.","Everything clicks in this action-packed cliffhanger. In his third (and what for years what thought to be his last) adventure, Indy is on the hunt for that ultimate treasure, the Holy Grail. Along the way he must contend with Nazis, a secret brotherhood and, of course, snakes. Sean Connery is a wonderful addition as Indy's father, and the chemistry between he and star Harrison Ford may just be one of the best in film history. The movie is a true rarity in that its attempts to outdo each preceding chase sequence succeed. Though children might have trouble interpreting the plot, this crusade is one people of all ages will enjoy.","\"Indiana Jones and the Last Crusade\" was supposed to be the final movie in the \"Indiana Jones\" series. At least that's what director Steven Spielberg and producer George Lucas said at the time this film hit theaters. But now they've said there will be a fourth \"Indiana Jones\" film. I really don't know if that's a good idea, because the \"Last Crusade\" was a fitting end to a great movie series. Harrison Ford returns for his third go around as swashbuckling hero Indiana Jones, this time accompanied by Sean Connery as Indy's father, Dr. Henry Jones. These two actors work beautifully together as they fight off the Nazis in search for the Holy Grail. Two actors from \"Raiders of the Lost Ark\" reprise their roles to great effect in \"Last Crusade\": Denholm Elliott as Marcus Brody and John Rhys-Davies as Sallah. Alison Doody is the heroine (good or bad?); Julian Glover is the villain; River Phoenix portrays a young Indy at the beginning to see how this character really got his start. \"Indiana Jones and the Last Crusade\" not only has great characters, it also has a decent story (taking place in 1938), plus exciting action scenes and special effects. It's better than the second film \"Temple of Doom\" and comes very close to topping the first film \"Raiders\". The \"Indiana Jones\" series should stay right where it is with the \"Last Crusade\" as the finale. Unless Spielberg, Lucas, and Ford can prove us wrong and make a really good fourth film in the series, we shall see. I loved all three movies in the \"Indiana Jones\" series. If the fourth film does gets made, I hope it'll be equally as good as the first three.**** (out of four)","Indiana Jones And The Last Crusade was, in my opinion, the best movie of the Indiana Jones trilogy. This movie featured the same type of humor we have become accustomed to from Jones, as well as another beautiful woman (also probably the best Indy girl) and lots of great action scenes! This movie starts off with a teenage Indy (River Phoenix) which gives us a look at an event that molds his life and character as well as his relationship with his father, Henry (Sean Connery). We also learn he is a \"Junior\" and that he hates to be called that.Back as an adult, Indy's father is kidnapped and he must set out to find him. His only clues are his father's diary notes, which were mysteriously sent to him earlier that day. They lead him to Italy, where he meets the gorgeous blonde, Dr. Elsa Schneider (Alison Doody), who becomes an integral part of this story.Once again, the grown up Indy (Harrison Ford) does battle with the Nazis. Apparently, Adolf Hitler is after the Holy Grail, which contains the blood of Christ. So Indiana and his father team up to get there first. Along the way, there is a great action scene where Jones fights a few Nazis on board a moving tank.Overall, as I mentioned earlier, I believe this to be the best Indiana Jones movie of the three. This action movie was good long before movie studios learned to make the great CGI and special effects. It's effects were pretty good anyways but back in 1989, things just did not look as good as they can make them today. Still, highly recommended and worth your time. 9.5/10","When the two greatest filmmakers in the world teamed up to create the best action movie of all time - Raiders of the Lost Ark, it seemed unlikely that they could duplicate their divinely-inspired work. After a miss with the entertaining yet forgettable Indiana Jones and the Temple of Doom, Indiana Jones and the Last Crusade comes pretty close to doing just that.Film history's most profitable star Harrison Ford returns to his signature role in a performance that speaks for itself, and benefits greatly from a gallery of memorable supporting characters. That includes Sean Connery, the grandest of all modern action day movie heroes (and appropriately cast, as the spiritual father of the character is James Bond). Connery plays against that, in a performance that is different than anything he has ever done, and it works. Even so, Denholm Elliott can't seem to help stealing every scene he's in as Marcus Brody, a lifelong friend of the Jones family.This movie stands by itself in the way it deals with spirituality, and is thick with religious themes throughout, without preaching to you. This is a very difficult balance to achieve in any film, and that alone makes the film stand out as brilliant. It is more abundant with humor than the previous two films, without the characters falling into irritating self-parody. Being a sequel, this is a difficult balance to achieve as well. (Look at action sequels such as Lethal Weapon 4).This film stands among the greatest action adventures of all time. I don't know anyone who hasn't seen it, but if you haven't, don't walk to see it. Run.","By the time of this writing, Blockbuster Inc. stores probably have all but vanished. Each with a sign that indicates that it's \"just this store\" that's closing. Sad, but that's how the story goes. Remember the Beta Video stores?When I was a kid, and we got our very first VCR – man, that was like the invention of television for those around my age – and I was able to save up enough money to buy two previously viewed movies. And get this: I had to actually pre-order previously viewed VCR tapes and they were incredibly $19.95 apiece!No matter; I really wanted both Lethal Weapon 2 and Indiana Jones and the Last Crusade. And bad.They were like gold for me. And they, along with a birthday gift of the original Batman, certainly earned their weight. I must've watched those three – my only movies – fifty times each.So, you can see: I am very familiar with Indiana Jones and the Last Crusade. Every inch, score number and frame. I love this movie.Later, I would contest and readily agree, Raiders of the Lost Ark is both a masterpiece and better film, but that doesn't deter on howmuchFUN this third installment is. And I'm not even mentioning the dreadful part two: Indiana Jones and the Temple of Doom. In my mind, there's only Indy 1 and 3. You can even forget the (yawn) Young Indiana Jones (so-called) Adventures.Everything worked in this movie: suburb acting, hilarious and fun dialogue – mostly from the chemistry (or banter) of the two Jones's, extreme adventure, exciting action, fantastic characters, nostalgia – for fans of Raiders and great twists. And one of the best aspects is also a spoiler, – sorry, but if you haven't seen this 22-year-old epic, that's your fault – it has one of the best endings in the history of cinema: they actually ride off into the sunset. Brilliant and beautiful ending to the series!** - that is until they ruined it with the overkill: Indiana Jones and the Kingdom of the Crystal Skull. Best advice? Think of this as the actual LAST adventure and forget that wretched sequel.Heck, I can't really pinpoint many, if any, faults or flaws in Last Crusade. Pooossssibly, the over-long opening segment with the original \"Young Indiana\" played by the late and great River Phoenix? Even that was entertaining, fun and had an awesome score track. So, technically, it's not a setback, but perhaps needed a little more editing.Indiana Jones (Harrison Ford) is overwhelmed at school, but is more so when his father, Henry Jones, Sr. (Sean Connery – in, Literally one of his best on-screen performances) is listed as missing. Indy is tempted with the prospect of finding the mystical Holy Grail, even though he, himself, doesn't believe it. He does set off on a mission to find his father, but we all know, he'd equally like to find this \"Lost Cup of Jesus Christ.\"He meets up with (what I grew up referring to as \"the blonde\") the beautiful and seductive dame Dr. Elsa Schneider (Alison Doody) and they quest to find daddy Jones and ward off Nazis. Not so much a spoiler, but he does rescue Henry Jones, Sr. and the race for the Grail is on between the Jones's and the Nazis.I left out a lot, but that's the basic, BASIC, premise. Seriously, if you have not seen this, or have even, see it (again, if you have) and learn to enjoy the film that frankly defines adventure. And a movie that captures the heart of the original, the atmosphere of the serials of before most of our times and how movies were really made: pre-CGI.On a related note: while some people are anti-3D, I am boarder-line anti-CGI. Sure it's a cheaper way of filmmaking, but I feel it's just that: cheap. Rarely will it be believable in my sight, for the most part it's all-but a cartoon and extremely laughable. That said, it can worksometimes. The recent 2010 Alice in Wonderland film is a perfect example of how it can really work and impress me. But, 80% of the time, it's just plain corny, distracting and again, CHEAP. My favorite action/adventures films are how they used to be made: with both inventiveness and heart. Like this one. Heck, I'll take a blue/green screen any day over a computer telling me what's \"real\" looking.But, I digress. I hesitate in calling this a masterpiece (in filmmaking, at least) but in my mind it is. And seeing that this is an opinion piece, I will go on record: it doesn't get much better than this.I remember some of the promotional shots on the late night shows from Harrison Ford, et al, that casually admitted Temple of Doom was a disaster – I AGREE – and this was a make-up movie. It sure the heck was! This was thee number one redemption movie of all time.Note to Hollywood: continue the redemption. Make movies like this, verses the CGI-laced, no-script films of the last decade or so. Remember what it's like to have this much fun in the movie going experience. I remember. I recall 1989 when this was released as my all-time favorite year in films released. Too bad, they haven't come close to '89 in 22 years.And Hollywood won't listen. I ask that you do. Support and watch movies like Indiana Jones and the Last Crusade. Remember what it was like to have fun in the theatre, what it was like when real special-effect crews did real work on the fields and not in the office and remember what it was like to be a kid again. See this movie!","\"Indiana Jones and the Last Crusade\" was the third and final instalment in the original Indiana Jones trilogy. Whereas \"Indiana Jones and the Temple of Doom\" was a prequel to \"Raiders of the Lost Ark\", \"Last Crusade\" is a true sequel. Apart from an opening scene relating an adventure of the teenage Indy as a Boy Scout in 1912, the action takes place in 1938, two years after \"Raiders\". (In this opening scene we learn how the hero got his nickname; Indiana is not, as I had always assumed, his home state, but a name borrowed from his pet dog).Whereas \"Raiders\" was a great commercial and critical success, \"Temple of Doom\" received considerable criticism, both on account of its dark, gloomy atmosphere and its racist treatment of Indian characters. Steven Spielberg, therefore, was determined to make the third film lighter in tone, closer in spirit to \"Raiders\". Once again the villains are the Nazis, once again the plot involves the search for a legendary relic with mystical powers (in this case the Holy Grail which caused such excitement among King Arthur and the Knights of the Round Table) and once again much of the action takes place in the Middle East. (This must be the only Hollywood film ever to be set- ostensibly- in the short-lived Republic of Hatay, formerly part of French Syria and today part of southern Turkey, which enjoyed a brief independence for several months in 1938/9. Most of the \"Hatay\" scenes, however, were shot in Spain, with the ruins of Petra, actually in Jordan, standing in for the temple in which the Grail is housed).The film also introduces us to Indy's father, Henry Jones, Sr. The James Bond films were undoubtedly one of the inspirations for this franchise, and it was possibly in their homage that Sean Connery was cast as the elder Jones, even though he is only twelve years older than Harrison Ford. (That speedboat chase along the Venetian canals also seems to be homage to Bond). Like his son, Henry senior is an academic archaeologist and has gone missing while seeking the Holy Grail. Indy believes that his father is in danger and sets out to find him, a quest that will take him to Venice, Germany and ultimately Hatay. The main female character is Henry's colleague, Dr. Elsa Schneider, a glamorous Austrian blonde whose loyalties are ambiguous.There is more stress on character development here than in other episodes of the franchise, with emphasis being placed on the father-son relationship. The film is not just about the search for the physical Holy Grail. Even in the Arthurian legend the Grail was as much a symbol as a physical object, and today the phrase \"holy grail\" is used metaphorically for anything which is desirable and much sought-after. The film is also about Indiana's search for his lost father and their efforts to re-establish a relationship which in the past has often been strained- the story's metaphorical Holy Grail. Ford and Connery are both good at bringing out this aspect of the story. There are also good contributions from Denholm Elliott as Indiana's bumbling colleague Marcus Brody and Alison Doody as the treacherous, seductively sinister Elsa.After the awful \"Temple of Doom\", \"Last Crusade\" represents a welcome return to form, both for Spielberg and for Ford, who seemed ill at ease in the earlier film but here is back to his old ebullient self. The film contains a better balance of suspense and humour than did its predecessor, much of the humour being at the expense of the hapless Marcus. There are some excellent action scenes, such as the train sequence in the opening scene, the escape from the Zeppelin and the tank chase though the desert. \"Last Crusade\" is a very enjoyable adventure film in the same tradition as \"Raiders\". 7/10","Summer 1989. I was 8 years old. I only managed 2 movies that summer, one being Ghostbusters 2 (which blew my eager young mind at the time) and Last Crusade (which also blew my mind). I don't think I could have asked for two bigger blockbusters to choose from. Having been a rabid child fan of Raiders and Temple of Doom all things Indy were fresh in my mind and even as an 8-year-old I truly 'got' Last Crusade.Set 2 years after Raiders, and 3 years after Temple of Doom, Last Crusade opens with a flashback to Indy's youth and an aggravating cameo by River Phoenix in the role. His anachronistic hair, androgynous physiognomy, and that fact that he looks absolutely nothing like Harrison Ford take me out of the film every time, and spoils the long opening scene for me. The opening does nothing apart from establish all of Indy's trademarks (the hat, the whip, the scar, the fear of snakes), which he apparently all got within five minutes. Luckily the film soon jumps forward to 1938 and the opening quickly is forgotten about as shady antique collector Walter Donovan encourages Indy to go after the Holy Grail.With Der Fuhrer also after the sacred chalice Indy must once again face off against the despicable Nazis, rescue his bumbling father (Sean Connery, having the time of his life), and keep one step ahead of Donovan with Sallah and Brody tagging along.There is loads of inventive, exciting action in many exotic, breath-taking locations and all of it is immaculately photographed by Douglas Slocombe in lovely anamorphic Panavision. Even with today's many advancements in movie camera technology you'll rarely see a film as beautifully photographed as this. All very high-key, mind you, the polar opposite of the dark, subterranean Temple of Doom.Now, herein lies my only gripe with Last Crusade (other than River Phoenix) is the fact that it's just too light-hearted. Spielberg expressed regret over the fact that he made Temple of Doom very dark and mean-spirited (which I don't agree with as it is my personal favorite) so he compensated by making Last Crusade more cheerful and bright. It's not an annoying shift in tone, but it could have been balanced out with a bit more blood and gore.Last Crusade makes the perfect end to the real Indiana Jones trilogy. Spielberg really should have left it as our hero, his dad, and his two sidekicks rode off into the sunset. How can you top that? How can you come back from that? But 19 years later he tarnished many reputations and spoiled many memories with the deeply, DEEPLY misjudged Kingdom of the Crystal Skull.It was an amazing film to see as a child, and it's a shame that kids these days are not exposed to anything as good. If you can turn a blind eye to River Phoenix you will surely have a great time with Last Crusade. It's not the Snake Car on the train he ought to worry about, it's the Viper Room on Sunset Boulevard.","It's a perfect action-adventure, with elements of fantasy. The best part is the coming together of Sean Connery and Harrison Ford. One is a field agent and the other is strictly an academician.Some films are timeless. This is one of them. No modern adventure film comes close to this.","The 1930s archaeologist and adventurer Indiana Jones (Harrison Ford) , a larger that life hero , with its battered hat and whip wielding will confront evil Nazis for the obtaining the Holy Grail . This time he makes couple with his daddy (Sean Connery) along with a beautiful woman (Alison Doody) and friends (Denholm Elliott and John Rhys Davies) . Brave and daredevil Indiana Jones risks his life facing off villains , taking on armoured tanks , warplane , cliffs and several dangers and adventures.Dr.Indiana executes feats of derring-do in various exotic countries . It's the finale part of adventures trilogy (along with : Raiders of the lost ark and Temple of Doom ) going on the way of the 30s classic films and the Comic-books language .The picture blends comedy , adventures , action , rip-roaring , Cliff-hunger , tongue-in-cheek and being extremely entertaining and fun . Harrison Ford plays magnificently as the valiant and impulsive archaeologist turned into an action man .F or comic relief in charge of continued jokes about the relationship between Indy and his dad .The picture has great loads of action , special effects abundant and habitual and impressive John Williams musical score .The movie has a spectacular intervening period when Indiana is fighting against a tank that will have you on the edge of your seat , but the action never lets up. In this flick appears River Phoenix as an adolescent Indiana in a spectacular and frenetic beginning. The film is followed by the TV series ,also produced by George Lucas : ¨The young Indiana Jones¨ with Sean Patrick Flannery. The motion picture was splendidly directed by Steven Spielberg , being his favorite of the \"Indiana Jones\" films , and it is on record as saying he directed the pic for two reasons: To fulfill a three-picture obligation he had made with George Lucas, and, and to atone for the criticism that he received for the previous installment, Indiana Jones and the temple of Doom (1984). It obtained some Academy Awards, secondary Oscars for editing and sound effects, very well deserved although I miss didn't achieve more. The movie will appeal to Indiana saga fans as well as the neophyte who didn't have seen the previous episodes .It's indispensable and essential watching . Rating : excellent , above average and well worth seeing. It's a winner for Harrison Ford fans.","The third and the best of the adventures of Indiana Jones. In this new film, the famous archeologist is searching for a mythical object: \"the Graal\". This is the glass in which the Christ would have drank during the last meal with his apostles. His father assists him in his investigations because he's got precious information about the Graal. So, a long trip begins and will lead our two heroes from Venice to the Middle East in passing by Berlin. You can guess it, this trip has got its rough patches (otherwise the movie would appear devoid of interest). Indeed, the Nazis wish to discover the Graal too because it would make them powerful even dangerous.Steven Spielberg designed his movie like a fascinating treasure hunt and he had the good idea by bringing Sean Connery. Thanks to his presence, the movie's got a certain humor (perhaps a little too convenient but the result works) and allows to lighten the movie.\"Indiana Jones and the last crusade\" is also a good surprise because it wipes out the unhappy memory of the previous movie: \"Indiana Jones and the temple of doom\". I found it too horrendous, bloody and even annoying due to Kate Capshaw. Here, to film Indiana Jones' incredible adventures, Spielberg adopted a dramatic and especially efficient film-making. He also avoids all that could make the movie fall in the faults quoted in the second movie. Moreover, there aren't any injury times, the rhythm is skilfully sustained (particularly during the pursuits) and it's better this way because the result is very convincing. Obviously, the movie doesn't go without a few unlikelinesses.Spielberg also brilliantly used the good old recipes for the adventure film: weird and exotic sceneries, the struggle between good and evil, the magic object that possesses supernatural powers etc...The only criticism I have to make of Spielberg is that the screenplay is perhaps well boosted but it doesn't also succeed in hiding a certain manicheism: the Nazis wish to get rid of Jones and his father and to discover the Graal would help them to satisfy their strength.An adventure movie entertaining enough to sustain the interest and rather well performed. Let's add the imposing music (as usual) composed by John Williams.","An ideal action-comedy/adventure if there ever was one; in this entertaining third installment archaeologist Ford must travel to Italy in 1938 to try and rescue his estranged father. However, the rescue mission soon turns into a historic quest as he seeks out the Holy Grail, once again finds himself battling Hitler's Nazis, and again encounters dangerous perils every step of the way. Follows basically the same formula as Raiders of the Lost Ark, but Connery is an added bonus as Ford's father and the two make a perfect duo. A good blend of elements as the film provides lots of exciting, cliffhanger action scenes/stunts, memorable lines, and genuine humor, but the relationship between the two leads is what really gives it stability. Lots of fun. ***½","This was an amazing movie, my personal favorite in the Indy series. Has good plot, a lot of humor, and some emotion too. not to mention plot twists","\"Indiana Jones and the Last Crusade\" was made in 1989 and bristles with excitement, humor, suspense, special effects and, as a real plus, character development. In the beginning we get to see young Indy (River Phoenix) and where he got his fear of snakes, etc., and we meet his father, Henry Jones (Sean Connery), a brilliant professor.In this story, Indiana Jones (Harrison Ford) leaves his teaching job to again save the world from the Nazis. They have kidnapped Indy's father for his diary. The Nazis seek nothing less than the Holy Grail, for which Henry Jones has maps and notations in his diary which can lead to it. The Holy Grail here is a chalice used by Jesus at the Last Supper, received by Joseph of Arimathea and said to possess miraculous powers. Joseph used the Grail to catch Christ's blood while interring him. It's up to Indy to free his father.Directed by Steven Spielberg, Indiana Jones and the Last Crusade takes the audience on a thrilling journey to Venice, Austria, Germany and remote locations. The film never lets up its fast pace and around every corner, there's a special effect, or funny dialogue, or a brilliant escape.The great cast also includes Julian Glover, John Rhys-Davies, Denholm Elliott, and Alison Doody.","After two successful big-budget starring vehicles, we finally get an origin story for Indiana Jones. Of course, that's largely to facilitate the addition of a new supporting character (Sean Connery in a wonderful casting as Indy's long lost father, who we'll get to in just a moment) but that extra layer of nostalgia, wrapped around a property that's deeply nostalgic in the first place, manages to avoid numerous pitfalls and serve as an effective prologue. River Phoenix performs especially well as the young Jones, expertly wearing Harrison Ford's mannerisms throughout the long callback, and somewhere along the way we get a worthwhile genesis for the grown-up version's affinity for leather jackets and fedoras.Once the story jumps ahead to a more familiar era (if not precisely the present), it's full speed ahead on the hunt for the mythical holy grail, a lifelong obsession for the father and recent fixation of the third reich. Soon reunited, both Jones boys dance through precarious situations and near-misses in the history books, a full battalion of Nazi soldiers nipping at their heels, before drawing close to the prize. Ford and Connery are dynamic together, boiling down a complicated father-son relationship to a series of glares, grins and grunts. They alternate between bickering testily and slapping each other on the back in camaraderie, and I honestly can't say which makes for a more entertaining watch. There's depth, too, a stinging blend of long-simmering resentment and earnest care for one another, which often bubbles up just in time to enhance the plot's heaviest moments.Naturally, it simply wouldn't be an Indiana Jones movie without big action sets (in which the series somehow manages to one-up itself yet again) or boatloads of witty retorts and punchy one-liners, and those two essential elements combine to give the film a loose, fun-loving quality without compromising any of the more serious moments. All this without going too far over the top, as we saw more than once in the mildly underwhelming Temple of Doom and borderline-disastrous Kingdom of the Crystal Skull. It's well-written and purposeful, successfully intense and humorous, an in-the-wheelhouse serial-styled adventure that spans several continents before confronting superstition and cracking several dusty, life-threatening riddles on the path to a biblical treasure. Indy probably should've left well-enough alone, because this chapter is essentially impossible to top.","Back to teaching, Indiana Jones finds out that his father has been kidnapped and he must set out to find him.His only clues are his father's diary notes, which were mysteriously sent to him earlier that day. They lead him to Italy, where he meets the alluring, Dr Elsa Schneider (Alison Doody.) She becomes an integral part of this story.Raiders of the Lost Ark was one hell of a ride, The Temple of Doom was too dark, too gruesome for some.The Last Crusade took the best elements of the first film. The Nazis, the search for a mystical religious artifact, Denholm Elliott and John Rhys Davies.The film starts with a sequence when Indy as a kid. This was an appetiser for Lucas's idea of the Young Indiana Jones adventures.The addition of Sean Connery as Indy's father leads to some of the best comic films in the moment, with also some literate moments, plenty of action and very nifty special effects.It is a Saturday afternoon at the movies spectacular.","1st watched 4/6/2002 - 7 out of 10(Dir-Steven Spielberg): Fun action and witty dialogue abound in this final(we think...) episode in the Indiana Jones three-some. What this movie lacked as far as special effects it didn't lack in the witty charm brought to the screen by the pairing of Connery & Ford. From the very beginning to the end it's hard to keep your eyes of the screen following these outrageous adventures and that's the allure of this series. This film actually tried to put some serious spiritiual overtones into the storyline by searching for the Holy Grail(the cup that Jesus drank from at the last supper) and the myth that it would give everlasting life to those who drank from it. There are the usual puzzles and hoops that Indiana has to go through to finish this journey(which make no sense from a realistic perspective), but it's obvious from the very beginning that we're watching an un-realistic hero in a movie and that's okay. All in all this one is a fun ride for the movie-goer which is the ultimate purpose in this one by the ever-entertaining Steven Spielberg.","Last Crusade is without a doubt my favorite of the Indiana Jones series, and I think a lot of people would agree. Sure there are some people who prefer Raiders of the Lost Ark, but this film is often regarded as one of the best sequels of all time. As it should be, it fixes most of the problems with it's predecessors, and enhances on the stuff that made that film work.There really isn't that much wrong with the movie, at it's worst moments it can be a little boring. But I also get confused as to what the movie is trying to do with with Dr. Shnieder. Spoiler Alert, but it turns out she's a Nazi, but then she's crying at the book burning, then she's clearly evil again, then she's good, then evil, by the end I wasn't sure if I was supposed to like her or not.The best part about this movie are the scenes between Indy and his dad. Harrison Ford and Sean Connery are downright hilarious at times, and have great chemistry, I actually believed that they were father and son. The action scenes are fantastic, and unlike Raiders the pacing is perfect, a perfect blend of action, comedy, drama, and adventure. Most of the special effects have held up pretty well, sure some stuff is obvious green screen but most of it's not noticeable. The villains are good, not quite as good as the ones from Raiders, but very threatening. The adventure element is great, it's sort of a mystery as well as a treasure hunt. And River Phoenix looks exactly like a young Harrison Ford.Despite not being a hardcore Indiana Jones fan, I say Last Crusade is one of the best adventure movies ever made. It's funny, exiting, has some great characters, and is very well written and directed.","This is a must see movie for fans of adventure. It came out when I was seven, but I saw it again recently and must admit it aged really well. A testament to the quality of story, acting, cinematography and oh my, the music!","The second sequel to Raiders of the Lost Ark is an awesome, beautifully crafted film, and arguably the best of the Indiana Jones trilogy. The film is funnier, classier and far more laid back than the other two woody story lines, mostly because of the introduction of the excellent Sean Connery as Indy's eccentric father. Spielberg and Lucas get back on track after their off the rails first sequel in which to many peoples' horror had none of the Nazis or characters that made Raiders so unique, however, what Spielberg does to make this film a classic is the use of historical data with the swashbuckling storyline of adventure and action. Not to mention that this may well be the greatest feel good film ever made..."],"cover":"https://m.media-amazon.com/images/M/MV5BMjNkMzc2N2QtNjVlNS00ZTk5LTg0MTgtODY2MDAwNTMwZjBjXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY150_CR0,0,101,150_.jpg"}]})
    })
})

test('GET /api/search?search=HelloWorld should return error, because film does not exist', async () => {
    return request(app)
    .get('/api/search')
    .query({
        search: "HelloWorld",
    })
    .expect(200, { status: 'error', error: 'movies not found'});
})

test('GET /api/search?search="" should return error, because search field is empty', async () => {
    return request(app)
    .get('/api/search')
    .query({
        search: "",
    })
    .expect(200, { status: 'error', error: 'movies not found'});
})

// Testing movies/:id api
test('GET /api/movies/:id should return information about film (example Joker)', async() => {
    return request(app)
    .get('/api/movies/Joker')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"ok","movie":{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","year":1991,"rating":4.6,"Starring rating":10,"genres":["Comedy","Crime"],"cast":["Björn Skifs","Aja Rodas-Evrén","Johan Ulveson","Marie-Chantal Long","Jacob Nordenson","Catherine Hansson","Gert Fylking","Johan Paulsen","P.G. Hylén","Björn Kjellman","Ragnar Ulfung","Peter Panov","Assen Panov","Lars Engström","Arne Rubensson","Fredrik Dolk","Hans Kellerman","Peter Ahlm","Hans Saxinger","Maud Höglund","Anders Esphagen","Margareta Pettersson","Claes Ljungmark","Ali Alibhai","Ann Canvert","Aldi Foddis","Hans O. Sjöberg","Dick Olsson","Victor Kritz-Hedqvist","Pontus Bjuring-Gerlich","Rinkeby Kids","Eric Bibb","Astors 'Pelle' Bellsybus","Lennart Järnstad"],"reviews":["This is Joker seemingly it is the swedish orginal which the joker reboot from 2019 have taken inspiration from. This is one of the best and well executed films in all time and of course they have Björn skifs in the role as Nicke the version of Joker in this universe. This is basically Joker hunted by the italian mafia while fighting nazis","This is a movie that only those who have felt alone and isolated can truly relate to it. You understand the motive and you feel sorry for the character. A lot of people will see this movie and think that it encourages violence. But truly, this movie should encourage each and every one of us to become a better person, treat everyone with respect and make each other feel like they belong in this world, instead of making them feel isolated.","I give him 10 on 10000000000999999999999999 ^9999"],"cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"}})
    })
})

test('GET /api/movies/:id with non-existing film should return error message (example test)', async() => {
    return request(app)
    .get('/api/movies/test')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status":"ok","movie":null})
    })
})

// Testin 200 to 230 (wachlist, reviews, addreview, removereviews) * * *
test('POST /api/watchlist updating watchlist while logout', async() => {
    return request(app)
    .post('/api/watchlist')
    .send({
        watchlist: "Joker"
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'error', error: 'invalid token' })
    })
})

test('POST /api/addreview adding review while logout', async() => {
    return request(app)
    .post('/api/addreview')
    .send({
        movie: "Joker",
        review: "Hello."
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'error', error: 'invalid token' })
    })
})

test('POST /api/watchlist add Joker to watchlit', async() => {
    return request(app)
    .post('/api/watchlist')
    .set('x-access-token', testToken)
    .send({
        watchlist: "Joker"
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', watchlist: 'Joker', msg: ' added to your watchlist.'})
    })
})

test('POST /api/watchlist add Aladdin to watchlit', async() => {
    return request(app)
    .post('/api/watchlist')
    .set('x-access-token', testToken)
    .send({
        watchlist: "Aladdin"
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', watchlist: 'Aladdin', msg: ' added to your watchlist.'})
    })
})

test('GET /api/watchlist check watchlist has Joker and Aladin', async() => {
    return request(app)
    .get('/api/watchlist')
    .set('x-access-token', testToken)
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status": "ok", "watchlist": [{"_id": "6287a44ed9c12de99b9357a5", "cover": "https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg", "title": "Joker"}, {"_id": "6287a44ed9c12de99b93582a", "cover": "https://m.media-amazon.com/images/M/MV5BY2Q2NDI1MjUtM2Q5ZS00MTFlLWJiYWEtNTZmNjQ3OGJkZDgxXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_SY150_CR0,0,101,150_.jpg", "title": "Aladdin"}]})
    })
})

test('POST /api/watchlist remove Aladdin from watchlit', async() => {
    return request(app)
    .post('/api/watchlist')
    .set('x-access-token', testToken)
    .send({
        watchlist: "Aladdin"
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', watchlist: 'Aladdin', msg: ' removed from your watchlist.'})
    })
})

test('GET /api/watchlist check watchlist has Joker and Aladin', async() => {
    return request(app)
    .get('/api/watchlist')
    .set('x-access-token', testToken)
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({"status": "ok", "watchlist": [{"_id": "6287a44ed9c12de99b9357a5", "cover": "https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg", "title": "Joker"}]})
    })
})

test('POST /api/addreview adding review to Joker as user test', async() => {
    return request(app)
    .post('/api/addreview')
    .set('x-access-token', testToken)
    .send({
        movie: "Joker",
        review: "This is my first review!"
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', review: "This is my first review!" })
    })
})

test('POST /api/addreview adding second review to Joker as user test', async() => {
    return request(app)
    .post('/api/addreview')
    .set('x-access-token', testToken)
    .send({
        movie: "Joker",
        review: "Hello... again."
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'error', error: 'invalid token' })
    })
})

test('POST /api/addreview adding review to Aladdin as user test', async() => {
    return request(app)
    .post('/api/addreview')
    .set('x-access-token', testToken)
    .send({
        movie: "Aladdin",
        review: "Hello."
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', review: "Hello." })
    })
})

test('GET /api/movies/Joker seeing new reviews of Joker', async() => {
    return request(app)
    .get('/api/movies/Joker')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body.reviews.slice(-1)).toEqual(["This is my first review!"])
    })
})

test('GET /api/reviews getting all user reviews as test user', async() => {
    return request(app)
    .get('/api/reviews')
    .set('x-access-token', testToken)
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'error', error: 'invalid token' })
    })
})

test('POST /api/removereviews tryng remove "Hello." review as test user', async() => {
    return request(app)
    .post('/api/removereviews')
    .set('x-access-token', testToken)
    .send({
        reviews: [{review:"Hello.", movie:"Aladdin", email:"test@google.com"}]
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'error', error: 'invalid token' })
    })
})

// Moderator
test('GET /api/reviews getting last two user reviews as Moderator', async() => {
    return request(app)
    .get('/api/reviews')
    .set('x-access-token', token)
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body.reviews.slice(-2).map(item => item.review)).toEqual(["This is my first review!", "Hello."])
    })
})

test('POST /api/removereviews removing "This is my first review!", "Hello." reviews as Moderator', async() => {
    return request(app)
    .post('/api/removereviews')
    .set('x-access-token', token)
    .send({
        reviews: [{review:"Hello.", movie:"Aladdin", email:"test@google.com"},
                  {review:"This is my first review!", movie:"Joker", email:"test@google.com"}]
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', reviews: [{review:"Hello.", movie:"Aladdin", email:"test@google.com"}, {review:"This is my first review!", movie:"Joker", email:"test@google.com"}] })
    })
})
/*
test('GET /api/reviews getting last two user reviews as Moderator', async() => {
    return request(app)
    .get('/api/reviews')
    .set('x-access-token', token)
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body.reviews.slice(-2).map(item => item.review)).toEqual(["This is my first review!", "Hello."])
    })
})

test('GET /api/movies/Joker seeing removed reviews of Joker', async() => {
    return request(app)
    .get('/api/movies/Joker')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body.reviews.slice(-1)).toEqual(["This is my first review!"])
    })
})
*/



// for clean database
test('POST /api/watchlist remove Joker from watchlit', async() => {
    return request(app)
    .post('/api/watchlist')
    .set('x-access-token', testToken)
    .send({
        watchlist: "Joker"
    })
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', watchlist: 'Joker', msg: ' removed from your watchlist.'})
    })
})
/*
describe('GET /api/v1/books', () => {
    let bookSpy; // Moking Book.find method
    beforeAll( () => {
        const Book = require('./models/Movie');
        bookSpy = jest.spyOn(Book, 'find').mockImplementation((criterias) => {
            return [{"status":"ok","movie":[{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","year":1991,"rating":4.6,"Starring rating":10,"genres":["Comedy","Crime"],"cast":["Björn Skifs","Aja Rodas-Evrén","Johan Ulveson","Marie-Chantal Long","Jacob Nordenson","Catherine Hansson","Gert Fylking","Johan Paulsen","P.G. Hylén","Björn Kjellman","Ragnar Ulfung","Peter Panov","Assen Panov","Lars Engström","Arne Rubensson","Fredrik Dolk","Hans Kellerman","Peter Ahlm","Hans Saxinger","Maud Höglund","Anders Esphagen","Margareta Pettersson","Claes Ljungmark","Ali Alibhai","Ann Canvert","Aldi Foddis","Hans O. Sjöberg","Dick Olsson","Victor Kritz-Hedqvist","Pontus Bjuring-Gerlich","Rinkeby Kids","Eric Bibb","Astors 'Pelle' Bellsybus","Lennart Järnstad"],"reviews":["This is Joker seemingly it is the swedish orginal which the joker reboot from 2019 have taken inspiration from. This is one of the best and well executed films in all time and of course they have Björn skifs in the role as Nicke the version of Joker in this universe. This is basically Joker hunted by the italian mafia while fighting nazis","This is a movie that only those who have felt alone and isolated can truly relate to it. You understand the motive and you feel sorry for the character. A lot of people will see this movie and think that it encourages violence. But truly, this movie should encourage each and every one of us to become a better person, treat everyone with respect and make each other feel like they belong in this world, instead of making them feel isolated.","I give him 10 on 10000000000999999999999999 ^9999"],"cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"}]}];
        });
    });
    afterAll(async () => { bookSpy.mockRestore(); bookSpyFindById.mockRestore(); });
    test('GET /api/v1/books should respond with an array of books', async () => {
        request(app).get('/api/movies').expect('Content-Type', /json/).then( (res) => {
            if(res.body && res.body[0])
                expect(res.body[0]).toEqual({"status":"ok","movie":[{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","year":1991,"rating":4.6,"Starring rating":10,"genres":["Comedy","Crime"],"cast":["Björn Skifs","Aja Rodas-Evrén","Johan Ulveson","Marie-Chantal Long","Jacob Nordenson","Catherine Hansson","Gert Fylking","Johan Paulsen","P.G. Hylén","Björn Kjellman","Ragnar Ulfung","Peter Panov","Assen Panov","Lars Engström","Arne Rubensson","Fredrik Dolk","Hans Kellerman","Peter Ahlm","Hans Saxinger","Maud Höglund","Anders Esphagen","Margareta Pettersson","Claes Ljungmark","Ali Alibhai","Ann Canvert","Aldi Foddis","Hans O. Sjöberg","Dick Olsson","Victor Kritz-Hedqvist","Pontus Bjuring-Gerlich","Rinkeby Kids","Eric Bibb","Astors 'Pelle' Bellsybus","Lennart Järnstad"],"reviews":["This is Joker seemingly it is the swedish orginal which the joker reboot from 2019 have taken inspiration from. This is one of the best and well executed films in all time and of course they have Björn skifs in the role as Nicke the version of Joker in this universe. This is basically Joker hunted by the italian mafia while fighting nazis","This is a movie that only those who have felt alone and isolated can truly relate to it. You understand the motive and you feel sorry for the character. A lot of people will see this movie and think that it encourages violence. But truly, this movie should encourage each and every one of us to become a better person, treat everyone with respect and make each other feel like they belong in this world, instead of making them feel isolated.","I give him 10 on 10000000000999999999999999 ^9999"],"cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"}]})
        });
    });
});*/