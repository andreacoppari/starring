global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = require('./index');
const { afterAll } = require("@jest/globals");

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
test('POST /api/register with success', async () => {
    return request(app)
    .post('/api/register')
    .send({
        username: "Tester",
        password: "Testpassword1",
        passwordR: "Testpassword1",
        email: "Tester@Tester.it",
      })
    .then((res) => {
        if(res.body)
        expect(res.body.status).toEqual('ok')
    })
})
test('POST /api/delete', async () => {
    return request(app)
    .post('/api/delete')
    .send({
        email: "Tester@Tester.it",
      })
    .then((res) => {
        if(res.body){
            expect(res.body.status).toEqual('ok')
        }     
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
            expect(res.body.movies.map(m => m.title)).toEqual(["Joker", "The Lion King", "Aliens", "The Godfather", "Pulp Fiction", "The Dark Knight", "It's a Wonderful Life", "The Lord of the Rings: The Fellowship of the Ring", "Ratatouille", "Back to the Future", "V for Vendetta", "Toy Story", "Hachi: A Dog's Tale", "Ford v Ferrari", "The Matrix"])
    })
})

// Testing newFilm api
test('GET /api/newfilm should return list of films based on release date', async () => {
    return request(app)
    .get('/api/newfilm')
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body.movies.map(m => m.title)).toEqual(["Everything Everywhere All at Once", "Spider-Man: No Way Home", "Ford v Ferrari", "Come and See", "Avengers: Endgame", "Spider-Man: Into the Spider-Verse", "Green Book", "Avengers: Infinity War", "Three Billboards Outside Ebbing, Missouri", "Dangal", "Hacksaw Ridge", "Mad Max: Fury Road", "The Grand Budapest Hotel", "Gone Girl", "12 Years a Slave"])
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
            expect(res.body.movie.map(m => m.title)).toEqual(["Joker"])
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
            expect(res.body.movie.map(m => m.title)).toEqual(["Joker", "Indiana Jones and the Last Crusade"])
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
            expect(res.body.movie.title).toEqual("Joker")
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
            expect(res.body).toEqual({ status: 'ok', review: 'Hello... again.' })
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
            expect(res.body.movie.reviews.slice(-2)).toEqual(["This is my first review!", "Hello... again."])
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
test('GET /api/reviews getting last tree user reviews as Moderator', async() => {
    return request(app)
    .get('/api/reviews')
    .set('x-access-token', token)
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body.reviews.reverse().splice(-3).map(item => item.review)).toEqual(["This is my first review!", "Hello... again.", "Hello."])
    })
})

test('POST /api/removereviews removing "This is my first review!", "Hello... again.", "Hello." reviews as Moderator', async() => {
    return request(app)
    .post('/api/removereviews')
    .set('x-access-token', token)
    .send({
        reviews: [{review:"Hello.", movie:"Aladdin", email:"test@google.com"},
                  {review:"This is my first review!", movie:"Joker", email:"test@google.com"},
                  {review:"Hello... again.", movie:"Joker", email:"test@google.com"}]
    })
    .expect(200)
    .then((res) => {
        if(res.body)
            expect(res.body).toEqual({ status: 'ok', reviews: [{review:"Hello.", movie:"Aladdin", email:"test@google.com"},
            {review:"This is my first review!", movie:"Joker", email:"test@google.com"},
            {review:"Hello... again.", movie:"Joker", email:"test@google.com"}]})
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

afterAll(done => {
    mongoose.connection.close()
    done()
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