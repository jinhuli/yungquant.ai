$(function () {
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $messageBox = $('#messageBox');

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', {message: $message.val(), sender: "user"});
        $message.val('');
    });

    socket.on('new message', function (data) {
        if(data.sender != "yq"){
            $messageBox.append("<div class='well' id='user' style='width:90%;'>" + data.msg + "</div>");
        }
        else{
            $messageBox.append("<div class='well' id='bot' style='width:90%;'>" + data.msg + "</div>");
        }
    })
});