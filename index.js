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

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));

//To use the layouts npm install express-ejs-layouts
app.use(expressLayouts);

//extract styles and script from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Setting up a view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

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