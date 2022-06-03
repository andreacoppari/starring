const request = require('supertest')
const express = require('express')

const app = require('./index')

test('index module should be defined', () => {
    expect(app).toBeDefined();
});

/*
describe('GET /api/search', () => {
    it('should get messages', async () => {
        await authenticatedRequest
        .get('/api/search')
        .query({
            search: "Joker",
        })
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
        expect(res.body).to.deep.equal([
            {"status":"ok","movie":[{"_id":"6287a44ed9c12de99b9357a5","title":"Joker","year":1991,"rating":4.6,"Starring rating":10,"genres":["Comedy","Crime"],"cast":["Björn Skifs","Aja Rodas-Evrén","Johan Ulveson","Marie-Chantal Long","Jacob Nordenson","Catherine Hansson","Gert Fylking","Johan Paulsen","P.G. Hylén","Björn Kjellman","Ragnar Ulfung","Peter Panov","Assen Panov","Lars Engström","Arne Rubensson","Fredrik Dolk","Hans Kellerman","Peter Ahlm","Hans Saxinger","Maud Höglund","Anders Esphagen","Margareta Pettersson","Claes Ljungmark","Ali Alibhai","Ann Canvert","Aldi Foddis","Hans O. Sjöberg","Dick Olsson","Victor Kritz-Hedqvist","Pontus Bjuring-Gerlich","Rinkeby Kids","Eric Bibb","Astors 'Pelle' Bellsybus","Lennart Järnstad"],"reviews":["This is Joker seemingly it is the swedish orginal which the joker reboot from 2019 have taken inspiration from. This is one of the best and well executed films in all time and of course they have Björn skifs in the role as Nicke the version of Joker in this universe. This is basically Joker hunted by the italian mafia while fighting nazis","This is a movie that only those who have felt alone and isolated can truly relate to it. You understand the motive and you feel sorry for the character. A lot of people will see this movie and think that it encourages violence. But truly, this movie should encourage each and every one of us to become a better person, treat everyone with respect and make each other feel like they belong in this world, instead of making them feel isolated.","I give him 10 on 10000000000999999999999999 ^9999"],"cover":"https://m.media-amazon.com/images/M/MV5BMDUzMjNjZWUtMjY5Ny00YjQ0LWEwYjgtMWYzOWU1MDdkOThhXkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_SY150_CR2,0,101,150_.jpg"}]},
        ]);
    })
})*/
/*
test('GET /api/search?search=Joker should return information of film Joker', async () => {
    return request(app)
    .get('/api/search')
    .query({
        search: "Joker",
    })
    .expect(200)
})*/
test('GET /api/movies/:id', async() => {
    return request(app)
    .get('/api/movies/Joker')
    .expect('Content-Type', /json/)
})