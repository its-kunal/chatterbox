<!-- Application Flow -->

## Data Flow

### From User App
- Authenticate User
- Connect to chatroom
- Send Message
- Recieve realtime messages

### Functional Parts
- Fill form for new users or existing users.
- Verify the users
- connect to the chatroom
- send message
- recieve message

### Form for new users and existing users
- Forms
    - Login
        - Username
        - password
    - Signup
        - Username
        - password
        - confirm password
- Chatroom
    - List of messages
    - Form to send new message

### From Server
- Authenticate
- Connect to socket
- Send message
- Emit message
