const request = require('supertest')
const videos = require('../routes/videos')


describe("Test for video routes", ()=>{

    // test for getting all videos
    it("GET all videos", ()=>{
        request(videos)
        .get('/videos/')
        .set('Accept','application/json')
        .expect('Content-Type', '/json/')
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual(expect.objectContaining({"videos": [
                {
                    "views": 0,
                    "_id": "60a7d4a23a493b769038a30f",
                    "title": "Dancing Plane",
                    "description": "Just for entertainment",
                    "category": "Meme",
                    "createdAt": "2021-05-21T15:41:22.771Z",
                    "updatedAt": "2021-05-21T15:41:31.728Z",
                    "duration": 31,
                    "mimeType": "video/mp4",
                    "path": "videos\\Dancing Plane With Bird - Airplane dance - Funny Video Full HD.mp4",
                    "size": 4.96
                },
                {
                    "views": 0,
                    "_id": "60aba24089f3585d242c7812",
                    "title": "The bank job",
                    "description": "Just for entertainment",
                    "category": "Movie",
                    "createdAt": "2021-05-24T12:55:28.161Z",
                    "updatedAt": "2021-05-24T12:55:47.196Z",
                    "duration": 6721.756708,
                    "mimeType": "video/mp4",
                    "path": "videos\\The.Bank.Job.2008.1080p.BluRay.x264.YIFY.mp4",
                    "size": 1644.12
                }
            ]}))
        })
    })


    // test for get video by id
    it('Get video by id', (done)=>{
        request(videos)
        .get('/videos/byId/60aba24089f3585d242c7812')
        .set('Accept', 'application/json')
        .expect('Content-Type', '/json/')
        .expect(200)
        .then((response)=>{
            console.log(response.body)
            expect(response.body).toEqual(
                expect.objectContaining({
                    "views": 0,
                    "_id": "60aba24089f3585d242c7812",
                    "title": "The bank job",
                    "description": "Just for entertainment",
                    "category": "Movie",
                    "createdAt": "2021-05-24T12:55:28.161Z",
                    "updatedAt": "2021-05-24T12:55:47.196Z",
                    "duration": 6721.756708,
                    "mimeType": "video/mp4",
                    "path": "videos\\The.Bank.Job.2008.1080p.BluRay.x264.YIFY.mp4",
                    "size": 1644.12
                })
            )
            done()
        }).catch((err)=>{
            done(err)
        }, 5055)
    })

    // test for posting video description
    it("Post a video", ()=>{

    })


})
