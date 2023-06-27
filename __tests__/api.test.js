const app = require('../app.js');
const request = require('supertest');
const express = require("express");

const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const connection = require('../db/connection.js')
const endpoints = require('../endpoints.json');
const { Query } = require('pg');

beforeEach(() => seed(testData))
afterAll(() => connection.end());


//All tests are encased in an array. This assists in counting through every route created. Remember to separate each routes describe block to assist in the count.
const pageCount = [
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
}),

describe('GET api/articles', () => {

}),

// Test 1 - api page returns with an object
// Test 2 - api page returns with endpoints json file
// Test 3 - api page returns with
// -  a brief description of the purpose and functionality of the endpoint.
// -  which queries are accepted.
// -  what format the request body needs to adhere to.
// -  what an example response looks like.
// Test 4 - amount of objects representing each route, equal to the amount of routes created

//This set of tests needs to be last as it counts the amount of other routes in its test
describe('GET /api', () => {
  describe('successful connection test(s)', () => {
    test('200: api page returns with an object', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toBe('object')
        })
    })
    test('200: api page returns with endpoints json file', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body).toEqual(endpoints)
        })
    })
    test('200: each object in endpoints file should return with description, query, body format and an example response (except for the first api example)', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
          let endpointCount = 0
          let descriptionCount = 0
          let queryCount = 1
          let bodyFormatCount = 1
          let exampleResponseCount = 1
          for (const route in body) {
            endpointCount++
            if (typeof body[route]['description'] === 'string' && body[route]['description'].length > 1) {
              descriptionCount++
              
            }
            if (Array.isArray(body[route]['queries']) === true) {
              queryCount++
            }
            if (typeof (body[route]['exampleResponse']) === 'object') {
              bodyFormatCount++
            }
            if (body[route]['exampleResponse'] != null) {
              const pageTitle = Object.keys(body[route]['exampleResponse'])
              console.log(pageTitle)
              if(Array.isArray(body[route]['exampleResponse'][pageTitle]) === true) {
                exampleResponseCount++
              }
            }
          }
          expect(endpointCount).toEqual(pageCount.length)
          expect(descriptionCount).toEqual(pageCount.length)
          expect(queryCount).toEqual(pageCount.length)
          expect(bodyFormatCount).toEqual(pageCount.length)
          expect(exampleResponseCount).toEqual(pageCount.length)
        })
    })
  })
})

]