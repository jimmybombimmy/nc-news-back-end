const app = require('../app.js');
const request = require('supertest');
const express = require("express");

const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data')
const connection = require('../db/connection.js')
const endpoints = require('../endpoints.json');
const {
  Query
} = require('pg');

const articles = require('../db/data/test-data/articles.js')


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
    describe('successful connection tests', () => {
      test('200: articles page returns an array containing objects of all articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            expect(Array.isArray(body.articles)).toBe(true)
          })
      })
      test('200: all articles should have their given properties as listed below', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles.length).toBeGreaterThan(0)
            for (let i = 0; i < body.articles.length; i++) {
              expect(body.articles[i]).toHaveProperty("article_id", expect.any(Number))
              expect(body.articles[i]).toHaveProperty("title", expect.any(String))
              expect(body.articles[i]).toHaveProperty("author", expect.any(String))
              expect(body.articles[i]).toHaveProperty("topic", expect.any(String))
              expect(body.articles[i]).toHaveProperty("created_at", expect.any(String))
              expect(body.articles[i]).toHaveProperty("votes", expect.any(Number))
              expect(body.articles[i]).toHaveProperty("article_img_url", expect.any(String))
            }
          })
      })
      test('200: articles should be ordered by created_at in descending order', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            let lastPostedArr = body.articles[0].created_at.match(/\d*/g)
            let lastPostedNum = Number(lastPostedArr.join(''))
            for (let i = 0; i < body.articles.length; i++) {
              let nextPostedArr = body.articles[i].created_at.match(/\d*/g)
              let nextPostedNum = Number(nextPostedArr.join(''))
              expect(lastPostedNum).toBeGreaterThanOrEqual(nextPostedNum)
              lastPostedNum = nextPostedNum
            }
          })

      })
      test('200: articles should not include a body when displayed as a full list', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles.length).toBeGreaterThan(0)
            for (let i = 0; i < body.articles.length; i++) {
              expect(body.articles[i]).not.toHaveProperty("body")
            }
          })
      })
      test('200: comment_count should be added to articles which totals the number of comments of each relevant article', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles[6]["comment_count"]).toBe(11)
            for (let i = 0; i < body.articles.length; i++) {
              expect(body.articles[i]).toHaveProperty("comment_count", expect.any(Number))
            }
          })
      })
    })
  }),

  describe('GET api/articles/:id', () => {
    describe('successful connection tests', () => {
      test('200: article page returns an object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({
            body
          }) => {
            expect(typeof body).toBe('object')
          })
      })
      test('200: article page returns with an article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body).toMatchObject({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 100,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
          })
      })
    })
    describe('web page error tests', () => {
      test('400: Bad request - not a number', () => {
        return request(app)
          .get(`/api/articles/${NaN}`)
          .expect(400)
          .then(({
            body
          }) => {
            expect(body).toMatchObject({
              message: "Bad Request"
            })
          })
      })
      test('404: Page not found - category_id number does not match', () => {
        return request(app)
          .get('/api/articles/9999')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body).toMatchObject({
              message: "Page Not Found"
            })
          })
      })
    })
  }),

  //To do: edit API page to reflect this
  describe('GET /api/articles/:article_id/comments', () => {
    describe('successful connection test(s)', () => {
      test('200: api page returns with an object', () => {
        return request(app)
          .get('/api/articles/9/comments')
          .expect(200)
          .then(({
            body
          }) => {
            expect(typeof body).toBe('object')
          })
      })
      test('200: articles comments return with all of the comments of that article', () => {
        return request(app)
          .get('/api/articles/9/comments')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body).toMatchObject({
              'comments': [{
                  comment_id: 1,
                  body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  article_id: 9,
                  author: 'butter_bridge',
                  votes: 16,
                  created_at: '2020-04-06T12:17:00.000Z'
                },
                {
                  comment_id: 17,
                  body: 'The owls are not what they seem.',
                  article_id: 9,
                  author: 'icellusedkars',
                  votes: 20,
                  created_at: '2020-03-14T17:02:00.000Z'
                }
              ]
            })
          })
      })
      test('200: All web pages return with the necessary keys if comment object(s) is/are present', async () => {
        const requests = []
        for (let i = 1; i <= 13; i++) {
          requests.push(
            request(app)
            .get(`/api/articles/${i}/comments`)
            .expect(200)
            .then(({
              body
            }) => {
              if (body.comments.length > 0) {
                for (let i = 0; i < body.comments.length; i++) {
                  expect(body.comments[i]).toHaveProperty("comment_id", expect.any(Number))
                  expect(body.comments[i]).toHaveProperty("body", expect.any(String))
                  expect(body.comments[i]).toHaveProperty("article_id", expect.any(Number))
                  expect(body.comments[i]).toHaveProperty("author", expect.any(String))
                  expect(body.comments[i]).toHaveProperty("votes", expect.any(Number))
                  expect(body.comments[i]).toHaveProperty("created_at", expect.any(String))
                }

              }
            })
          )
        }
        await Promise.all(requests)
      })
      test("200: comments should run in order from most recent to least recent", async () => {
        const requests = []
        for (let i = 1; i <= 13; i++) {
          requests.push(
            request(app)
            .get(`/api/articles/${i}/comments`)
            .expect(200)
            .then(({
              body
            }) => {
              if (body.comments.length > 0) {
                for (let i = 0; i < body.comments.length; i++) {
                  let lastPostedArr = body.comments[0].created_at.match(/\d*/g)
                  let lastPostedNum = Number(lastPostedArr.join(''))
                  for (let i = 0; i < body.comments.length; i++) {
                    let nextPostedArr = body.comments[i].created_at.match(/\d*/g)
                    let nextPostedNum = Number(nextPostedArr.join(''))
                    expect(lastPostedNum).toBeGreaterThanOrEqual(nextPostedNum)
                    lastPostedNum = nextPostedNum
                  }
                }
              }
            })
          )
        }
        await Promise.all(requests);
      })
      
    })
    describe('web page error tests', () => {
      test('400: Bad request - not a number', () => {
        return request(app)
          .get(`/api/articles/${NaN}/comments`)
          .expect(400)
          .then(({
            body
          }) => {
            expect(body).toMatchObject({
              message: "Bad Request"
            })
          })
      })
      test('404: Page not found - category_id number does not match', () => {
        return request(app)
          .get('/api/articles/9999/comments')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body).toMatchObject({
              message: "Page Not Found"
            })
          })
      })
    })
  }),



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
          .then(({
            body
          }) => {
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
                if (Array.isArray(body[route]['exampleResponse'][pageTitle]) === true) {
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