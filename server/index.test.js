const request = require('supertest')
const app = require('./index')

test('index module should be defined', () => {
    expect(app).toBeDefined();
});

describe('GET /api/search', () => {
    it('should get messages', async () => {
        await authenticatedRequest
        .get('/api/search')
        .query({
            search: "J",
        })
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
        expect(res.body).to.deep.equal([
         {
          id: '247b1dd0-6fab-47a8-a9c8-1405deae0ae8',
          sender_id: '0cd30aef-9c4e-4a23-88e3-3547971296e5',
          receiver_id: null,
          file: null,
          text: 'What time is it ?',
          is_read: true,
          created_at: '2019-02-12T07:49:07.556Z',
         },
        ]);
    })
})