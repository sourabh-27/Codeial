const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const port = 8000;

const app = express();

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');

//mongo store
const MongoStore = require('connect-mongo')(session);

//sass middleware
const sassMiddleware = require('node-sass-middleware');

//connect-flash for messages
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));

//To use the layouts npm install express-ejs-layouts
app.use(expressLayouts);

//makes the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

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
    secret: 'blahsomething',
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