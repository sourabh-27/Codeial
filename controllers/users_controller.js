// console.log("I am inside users controller");
module.exports.profile = function(req, res){
    return res.render('user_profile',{
        title: "Users"
    });
};