module.exports.chatSockets = function(socketServer){

    // let io = require("socket.io")(socketServer);
    //in course only above line is there, but we were getting error related to cors,after searching added below
    //code and it worked
    let io = require("socket.io")(socketServer, {
        cors: {
          origin: "http://54.245.69.175:80",
          methods: ["GET", "POST"]
        }
      });
      
    //we created a class in js/chat_engine.js, the at home.ejs as soon as the class initiates, we send the
    // connection req using code io.connect(), and the connectionHandler() detects, using the socket,
    // on the server side in this file, whenver connection req is recieved , it automatically sent back
    // acknowdledgement to the front end/ user using below function, that 'new connection recieved'

    // when in chat_engine.js, this.socket.on("connect") code runs, connection event generates and catched
    // here
    io.sockets.on('connection', function(socket){
        console.log('new connection recieved', socket.id);
        // whenever the client disconnects, automatically disconnect event is fired
        // and that event is catched here
        socket.on("disconnect", function(){
            console.log("socket disconnected");
        });


        socket.on("join_room", function(data){
            console.log('joining request is recieved', data);
            // this will make the user joint the masterChatRoom, if it is already created, else it will
            // make the room first and make the user join
            socket.join(data.chatroom);
            // we want other users in the room, that user has joined the room
            io.in(data.chatroom).emit('user_joined', data);
        })

        // it will detect send_message event from chat_engine.js and broadcast to everyone in masterChatRoom
        socket.on("send_message", function(data){
            io.in(data.chatroom).emit("recieve_message", data);
        })

    });
    
  
}