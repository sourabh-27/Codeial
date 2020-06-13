const Post = require("../models/post");

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, user){
        if(err){
            console.log(`Error in createing the post: ${err}`);
            return;
        }
        return res.redirect('back');
    });
}