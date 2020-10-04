const express = require('express');
const app = express();

const server = require('http').Server(app);
const io  = require('socket.io')(server);
console.log("Gaurav:::io" , io);
const {v4: uuidV4} = require('uuid');

app.set('view engine','ejs');

app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room});
});


io.on('connection', (socket) => {
    console.log("Gaurav:::Connection triggered");
    socket.emit('chat-message','Hello world');

    socket.on('join-room',(roomId,userId)=>{
        console.log("Gaurav:::Connection triggered with room and User Id",roomId,userId);
        console.log('RoomId,UserId',roomId,userId);
        socket.join(roomId);
        console.log("Gaurav:::Joined to room",roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId,roomId);
        console.log('Gaurav:::emmitted User Connected',userId);
        socket.on('disconnect',() => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    })
});

server.listen(3000);