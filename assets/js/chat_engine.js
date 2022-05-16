class chatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBoxId = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //to start the chat server
        // io is global variable given to us, as soon as we inculded cdnjs file of socket.io
        this.socket = io.connect("http://54.245.69.175:5000");

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log("Connection Established using sockets....!");

            //this is the request user send to initiate chat,first argument is name of the room, second
            //argument is json object, sending self email, and the room I want to join
            // when this event is emmited, it will be recieved in chat_sockets.js,by socket.on("join_room")
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'masterChatRoom'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user joined!', data);
            });

            // code to send messge to user, so here we would emit, and in chat_sockets.js we would recieve
            // the send_message event generated with .on method

            $("#send-message").click(function(){

                let msg = $("#chat-message-input").val();

                if (msg != ''){
                    self.socket.emit('send_message',{
                        message: msg,
                        user_email: self.userEmail,
                        chatroom: 'masterChatRoom'
                    });
                }
            });


            //code to detect acknowledgement sent be server side after recieving messge
            self.socket.on('recieve_message', function(data){
                console.log('message recieved', data.message);


                let newMessage = $('<li>');

                let messageType = 'other-message';

                if(data.user_email == self.userEmail){
                    messageType = 'self-message';
                }

                newMessage.append($('<span>', {
                    'html': data.message
                }));

                newMessage.append($('<sub>', {
                    'html': data.user_email
                }));


                newMessage.addClass(messageType);


                $("#chat-messages-list").append(newMessage);
            })



        })
    }
}