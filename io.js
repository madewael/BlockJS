var io = require('socket.io');

function install(server) {
    io = io(server);
    io.on('connection', handleNewConnection);
}

function handleNewConnection(socket) {
    console.log("socket-io connection");
    socket.emit('message', "conneced");
    socket.emit('message', io.engine.clientsCount);

    socket.on('broadcast', (data) => {
        data.src = socket.id;
        console.log(data);
        socket.broadcast.emit('message', data);
    });

    socket.on('message', (data) => {
        if (data.tar) {
            data.src = socket.id;
            socket.broadcast.to(data.tar).emit('message', data);
        } else {
            console.log("unaddressed message", data);
        }
    });

}

module.exports = install;