var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

var dbconfig = require('./dbconfig')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = dbconfig.url;

var Message = mongoose.model('Message',{
    name: String,
    message: String

})

// var messages = [
//     {name: 'Time', message: 'hello'},
//     {name: 'Jane', message: 'hi'}
// ]

// route: get endpoint
app.get('/messages', (rq, rs)=>{
    Message.find({}, (err, messages)=>{
        rs.send(messages)
    })
})
// route: post endpoint
app.post('/messages', (rq,rs)=>{
    var message = new Message(rq.body)
    message.save((err)=>{
        if(err) sendStatus(500);

        console.log('post received: ',rq.body)
        //messages.push(rq.body)
        io.emit('message', rq.body)
        // rs.send(rq.body)
         rs.sendStatus(200)
    }) 
})

io.on('connection', (socket)=>{
    console.log('user connected');
})

mongoose.connect(dbUrl, {useNewUrlParser:true, useUnifiedTopology: true}, (err)=>{
    console.log('db connect', err);
})

var server = http.listen(3000, ()=>{
    console.log('server listening on ', server.address().port)
})


