const express = require('express');
const port = 8000;

const expressLayouts = require('express-ejs-layouts');


const app = express();

app.use(express.static('./assets'));

//To use the layouts npm install express-ejs-layouts
app.use(expressLayouts);

//extract styles and script from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Use express router
app.use('/', require('./routes/index'));

//Setting up a view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        // console.log("Error in running the server", err);
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`The server is up and running on port: ${port}`);
})