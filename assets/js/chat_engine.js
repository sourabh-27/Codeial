class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://54.80.108.116:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log("Self is: ", self);
            console.log("Connection Established using sockets..!");

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user joined!', data);
            });
        });

        //send the message on clicking the send button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('Message received', data.message);

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
            $('#chat-messages-list').append(newMessage);
        });
    }
}