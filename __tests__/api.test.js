const app = require('../app.js');
const request = require('supertest');

const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const connection = require('../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => connection.end());

describe("GET /api/topics", () => {
  describe("successful connection test(s)", () => {
    test("200: expect page to respond with corresponding topics table", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body).toEqual(testData.topicData)
          expect(body).toHaveLength(3)
          for (let i = 0; i < body.length; i++) {
            expect(body[i]).toHaveProperty("slug", expect.any(String))
            expect(body[i]).toHaveProperty("description", expect.any(String))
          }
        })
    })
  })
  describe('web page error test', () => {
    test("404: Come back with error if route not correct", () => {
      return request(app)
        .get("/api/tops")
        .expect(404)
    })
  })
})