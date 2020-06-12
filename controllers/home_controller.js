module.exports.home = function(req, res){
    console.log(req.cookies);
    console.log("I am going to render the home page");
    return res.render('home', {
        title: "Home"
    });
};