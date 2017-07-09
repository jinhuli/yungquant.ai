var PythonShell = require('python-shell');

var chat = function(io) {
    
     connections = [];

    io.sockets.on('connection', function(socket){
        connections.push(socket);
        console.log('connected %s sockets connected', connections.length);
        io.sockets.emit('new message', {msg: "Welcome to Yung Quant, your personal quantitative developer and analyst. If you're a regular, you know what to do. If you're a newbie ask for help!", sender: "yq"});


        //Disconnect
        socket.on('disconnect', function(data){
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        });

        //Send Message
        socket.on('send message', function(data){
            io.sockets.emit('new message', {msg: data.message, sender: "user"});
            if(data.message == "Hi" || data.message == "hi" || data.message == "hey" || data.message == "Hey"){
                io.sockets.emit('new message', {msg: "Hi! Let's make some money \\m/", sender: "yq"}); return;
            }
            if(data.message == "Help" || data.message == "help" || data.message == "Help me" || data.message == "help me"){
                io.sockets.emit('new message', {msg: "First, make sure you've had a look at the Strategies page and know which strategy you're interested in. Once you've done that, find your strategy under the prompts heading to my left and send me a message with your strategy prompt with the universe that you're interested in trading", sender: "yq"});
                io.sockets.emit('new message', {msg: "Here's and example: 'rev spdr' This will screen for stocks from the spdr ETFs using the mean reversion strategy", sender: "yq"});
                var helpOptions = {
                    args: "rev spdr",
                    pythonPath: "python3"
                }
                PythonShell.run('/python/controller.py', helpOptions, function(err, res){
                    if(err) throw err;
                    console.log(res);
                    io.sockets.emit('new message', {msg: res[0], sender: "yq"});
                    io.sockets.emit('new message', {msg: res[1], sender: "yq"});
                    io.sockets.emit('new message', {msg: "As you can guess, those are the stocks that you would buy and sell using the mean reversion strategy. If you want to see the stock chart for any of those, look at the charts to my right and type in the symbol you want to see in the top left text box of any of those charts", sender: "yq"});
                    io.sockets.emit('new message', {msg: "Hope that helps! Happy investing", sender: "yq"});
                    return;
                });    
            }
            else{
                var options = {
                    args: data.message,
                    pythonPath: "python3"
                }
                PythonShell.run('/python/controller.py', options, function(err, res){
                    if(err) throw err;
                    console.log(res);
                    if(res==null){
                        io.sockets.emit('new message', {msg: 'Sorry! Make sure you\'ve given a proper prompt and universe!', sender: "yq"});
                    }
                    else{
                        io.sockets.emit('new message', {msg: res[0], sender: "yq"});
                        io.sockets.emit('new message', {msg: res[1], sender: "yq"});
                    }
                });
            }
        });
    });
}

module.exports = chat;