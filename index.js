const express = require('express');
const env = require('./config/enviornment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const port = 8000;
const path = require('path');

const app = express();
require('./config/view-helpers')(app);

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');

const passportGoogle = require('./config/passport-google-oauth2-strategy');

//mongo store
const MongoStore = require('connect-mongo')(session);

//sass middleware
const sassMiddleware = require('node-sass-middleware');

//connect-flash for messages
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const development = require('./config/enviornment');

//setting up the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000");

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: true,
        outputStyle: "extended",
        prefix: '/css'
    }));
}

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, env.asset_path)));

//To use the layouts npm install express-ejs-layouts
app.use(expressLayouts);

//makes the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

//extract styles and script from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Setting up a view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//Mongo Store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || "Connect-mongo-db setup ok");
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//Use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        // console.log("Error in running the server", err);
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`The server is up and running on port: ${port}`);
})