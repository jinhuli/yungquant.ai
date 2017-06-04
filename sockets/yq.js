var PythonShell = require('python-shell');
var options = {
    args: [10000],
};

var chat = function(io) {
    
     connections = [];

    io.sockets.on('connection', function(socket){
        connections.push(socket);
        console.log('connected %s sockets connected', connections.length);

        //Disconnect
        socket.on('disconnect', function(data){
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        });

        //Send Message
        socket.on('send message', function(data){
            io.sockets.emit('new message', {msg: data.message, sender: "user"});
            PythonShell.run('test.py', options, function(err, res){
                if(err) throw err;
                io.sockets.emit('new message', {msg: res, sender: "yq"});
            });
        });
    });
}

module.exports = chat;