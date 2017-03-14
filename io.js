//const Block = require("./public/javascripts/bc/block.js");
//const Node = require("./public/javascripts/bc/node.js");
//const MSG = require("./public/javascripts/bc/messages.js");

function handleNewConnection(io, socket) {
    console.log("socket-io connection");
    socket.emit('message', "hallo");
    socket.on('broadcast', (data)=>{
        socket.broadcast.emit('message',data);
    });
}

function install(io) {
    io.on('connection', function (socket) {
        handleNewConnection(io, socket);
    });
}

module.exports = install;