var PythonShell = require('python-shell');

var chat = function(io) {
    
     connections = [];

    io.sockets.on('connection', function(socket){
        connections.push(socket);
        console.log('connected %s sockets connected', connections.length);

        //initial message
        socket.on('page ready', function(data){
            io.sockets.emit('forUser', {msg: "Welcome to Yung Quant, your personal quantitative developer and analyst. If you're a regular, you know what to do. If you're a newbie ask for help!", sender: "yq", id: data.id});
        });


        //Disconnect
        socket.on('disconnect', function(data){
            connections.splice(connections.indexOf(socket), 1);
            console.log('Disconnected: %s sockets connected', connections.length);
        });

        //Send Message
        socket.on('toYQ', function(data){
            io.sockets.emit('forUser', {msg: data.message, sender: data.sender, id: data.id});
            if(data.message == "Hi" || data.message == "hi" || data.message == "hey" || data.message == "Hey"){
                io.sockets.emit('forUser', {msg: "Hi! Let's make some money \\m/", sender: "yq", id: data.id}); return;
            }
            if(data.message == "Help" || data.message == "help" || data.message == "Help me" || data.message == "help me"){
                io.sockets.emit('forUser', {msg: "First, make sure you've had a look at the Strategies page and know which strategy you're interested in. Once you've done that, find your strategy under the prompts heading to my left and send me a message with your strategy prompt with the universe that you're interested in trading", sender: "yq", id: data.id});
                io.sockets.emit('forUser', {msg: "Here's and example: 'rev spdr' This will screen for stocks from the spdr ETFs using the mean reversion strategy", sender: "yq", id: data.id});
                var helpOptions = {
                    args: "rev spdr",
                    pythonPath: "python3"
                }
                PythonShell.run('/python/controller.py', helpOptions, function(err, res){
                    if(err) io.sockets.emit('forUser', {msg: 'Sorry! Something weird happened, could you send that again please? If the issue persists, please contact shane.kennedy19@gmail.com', sender: "yq", id: data.id});;
                    console.log(res);
                    io.sockets.emit('forUser', {msg: res[0], sender: "yq", id: data.id});
                    io.sockets.emit('forUser', {msg: res[1], sender: "yq", id: data.id});
                    io.sockets.emit('forUser', {msg: "As you can guess, those are the stocks that you would buy and sell using the mean reversion strategy. If you want to see the stock chart for any of those, look at the charts to my right and type in the symbol you want to see in the top left text box of any of those charts", sender: "yq", id: data.id});
                    io.sockets.emit('forUser', {msg: "Hope that helps! Happy investing", sender: "yq", id: data.id});
                    return;
                });    
            }
            else{
                var options = {
                    args: data.message,
                    pythonPath: "python3"
                }
                PythonShell.run('/python/controller.py', options, function(err, res){
                    if(err) io.sockets.emit('forUser', {msg: 'Sorry! Something weird happened, could you send that again please? If the issue persists, please contact shane.kennedy19@gmail.com', sender: "yq", id: data.id});
                    console.log(res);
                    if(res==null){
                        io.sockets.emit('forUser', {msg: 'Sorry! Make sure you\'ve given a proper prompt and universe!', sender: "yq", id: data.id});
                    }
                    else{
                        io.sockets.emit('forUser', {msg: res[0], sender: "yq", id: data.id});
                        io.sockets.emit('forUser', {msg: res[1], sender: "yq", id: data.id});
                    }
                });
            }
        });
    });
}

module.exports = chat;