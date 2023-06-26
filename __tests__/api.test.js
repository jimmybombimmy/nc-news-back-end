const app = require('../app.js');
const request = require('supertest');

const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const connection = require('../db/connection.js')

beforeEach(() => seed(testData))
afterAll(() => connection.end());

describe.only("GET /api/topics", () => {
  test("200: respond with an okay message", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body).toMatchObject(testData.topicData)
      })
  })
  test("200: Check that all of the columns match their respective names", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body[0]).toHaveProperty("slug", expect.any(String))
        expect(body[0]).toHaveProperty("description", expect.any(String))
      })
  })
  test("200: Check that all of the columns have the right length", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveLength(3)
      })
  })
  test("404: Come back with error if route not correct", () => {
    return request(app)
      .get("/api/tops")
      .expect(404)
  })
})