const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const app = express();
const server = http.createServer(app);



const io = socketIO(server);

server.listen(3000, () => {
    console.log('running');
})

app.use(express.static(__dirname+'/public'));

const history = [];

io.on('connection', (socket) => {

    history.forEach(line=>{
        socket.emit('draw', line)
    });
    
    socket.on('draw', (line) => {
        history.push(line);
        io.emit('draw', line)
    });

});