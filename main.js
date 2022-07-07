const express = require('express')
const app = express()
const port = 3000
const topic = require('./lib/topic')
const author = require('./lib/author')
const bodyParser = require('body-parser')
const compression = require('compression')

app.use(bodyParser.urlencoded({ extended: false }))
// 데이터를 압축하여 네트워크 트래픽을 줄이는 서드파티 라이브러리
app.use(compression())
app.use(express.static('public'))

app.get('/', (req, res) => {
    topic.home(req, res)
})

app.get('/topics/create', (req, res) => {
    topic.create(req, res);
})

app.post('/topics/create_process', (req, res) => {
    topic.create_process(req, res)
}) 

app.get('/topics/update/:topicsId', (req, res) => {
    topic.update(req, res)
})

app.post('/topics/update_process', (req, res) => {
    topic.update_process(req, res)
})

app.post('/topics/delete', (req, res) => {
    topic.delete(req, res)
    res.redirect('/')
})

app.get('/topics/:topicsId', (req, res) => {
    topic.page(req, res);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})