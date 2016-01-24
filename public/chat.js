window.onload = function() {
 
    
    var messages = []; // Stores incoming messages
    var user_info = {}; // Stores user info
    
    var socket = io.connect('127.0.0.1:3700'); // Chat server address
    
    // Shortcuts for HTML elements
    var user_id = document.getElementById("userID");
    var userlist = document.getElementById("userlist");
    var msgfield = document.getElementById("msgfield");
    var sendButton = document.getElementById("sendbtn");
    var aliasButton = document.getElementById("aliasbtn");
    var aliasLabel = document.getElementById("alias");
    var content = document.getElementById("content");

    /*  
        Handles message event
        function: Pushes incoming message. Converts it to HTML then writes it to "content" div
        input: message event and message data
    */
    function print_msg(data){
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                if(messages[i].userID)
                    html += messages[i].userID +": " + messages[i].content + '<br />';
                else
                    html += messages[i] + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("Houston, we have a problem:", data);
        }
    }
    
    
    
    /*  
        Handles refresh_userlist event. When someone maybe myself wants to change or set own alias, pushes alias button, writes alias.
        function: Gets the users info list. Converts to HTML then writes it to "userlist" div
        input: "refresh_userlist" event and user's info data
    */
    function print_userlist(data){
        if(data) {
            var html = '';
            console.log(data);
            for(var key in data) {
                    html += key +": " + data[key].alias + '<br />';
            }
            userlist.innerHTML = html;
        } else {
            console.log("Houston, we have a problem:", data);
        }
    }
	
    /*  
        Sends message.  
        function: Gets alias. If not setted gets user's id. Gets message from "msgfield" inputbox. Sends those to Chat server as "send" event 
        transmitted: "send" event and userID/alias and message data
    */
    function send_msg(){
        var text = msgfield.value;
        var userID = '';
        if (aliasLabel.innerHTML){
            userID = aliasLabel.innerHTML;
        }
        else{
            userID = user_id.value;
        }        
        socket.emit('send', { message: {
            userID: userID,
            content: text} });
        msgfield.value = '';
    }
    
    /*  
        Sends users new alias.  
        function: Gets alias from user by prompt. Sets it to "alias" heading, Sends it to Chat server as "send_alias" event 
        transmitted: "send_alias" event and alias data
    */
    function set_alias(){
        var alias = prompt("Please enter your alias", "usr2033");
        
        var userID = user_id.value;
        user_info[userID] = {alias: alias};
        if (alias != null){
            aliasLabel.innerHTML = alias;
            document.title = "Real time web chat:" + alias;
            socket.emit('send_alias', user_info
            );
        }
    }
        
    socket.on('message', print_msg); // on "message" event trigers "print_msg" function
    socket.on('refresh_userlist', print_userlist); // on "refresh_userlist" event trigers "print_userlist" function
    sendButton.onclick = send_msg; // on click to "sendButton" event trigers "send_msg" function
    aliasButton.onclick = set_alias; // on click to "aliasButton" event trigers "set_alias" function
 
}