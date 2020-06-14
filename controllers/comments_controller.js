const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();
    
            res.redirect('/');
        }
    }catch(err){
        console.log(`Error in writing the comment in the post: ${err}`);
        return;
    }
}

module.exports.destroy = async function(req, res){
    console.log("Gonna destroy it !! ");
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            if(err){
                console.log("Error in deleting the comment from comments array from post");
                return;
            }
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log(`Error in destroying the comment: ${err}`);
        return;
    }
}