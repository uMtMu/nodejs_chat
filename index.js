/* 
    Express is a minimal and flexible Node.js web application framework
    that i used for simply request handling and giving response 
*/
var express = require("express");
var app = express();
var port = 3700;

/*
    Express template settings
    I used Jade as template library
*/
app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

userinfo_list = {};
messages = [];

/*
    root directory of our chat application
    It gets response and response chat client with random user id
*/  

app.get("/", function(req, res){
    user_id = Math.floor((Math.random() * 1000) + 3);
    userinfo_list[user_id] = {alias: ""};
    res.render("chat", {
		page_data: 	{
			userID: user_id,
            users: userinfo_list
		}
	});
});

app.use(express.static(__dirname + '/public'));

/*
    I used socket.io for emitting and recieving events
    socket.io library has connect, message and disconnect default events.
    Also you can write your own events like "send_alias" or "refresh_userlist"
*/
var io = require('socket.io').listen(app.listen(port));


/*
    socket.io listens through express and creates new connection between server
    and client. Through this connection it waits for event shown below and stores
    and emits data
*/
io.sockets.on('connection', function (socket) {
    
    /*
        First thing first. Welcome our users :)
    */
    socket.emit('message', { message: 'welcome to the chat' });
    
    /*
        When it gets "send" event from a client it emits the message to all clients
        that connected server
    */
    socket.on('send', function (data) {
        messages.push(data);
        io.sockets.emit('message', data);
    });
    
    /*
        Likewise when it gets "send_alias" event from a client it changes or sets 
        user's alias and emits the whole user list to all clients that connected server
    */
    socket.on('send_alias', function (data) {
        var user_id = Object.keys(data)[0];
        if(user_id in userinfo_list){
            userinfo_list[user_id] = data[user_id];
        }else{
            userinfo_list[user_id] = '';
        }
        io.sockets.emit('refresh_userlist', userinfo_list);
    });
});

console.log("Listening on port " + port)