const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post=await post.populate('user').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'Post created!'
            });
        }

        req.flash('success', 'Post Published!');
        return res.redirect('back');
    }catch(err){
        // console.log(`Error in createing the post: ${err}`);
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return;
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into strings
        if(post.user == req.user.id){

            //destroy the associated likes on the post and its associated comments
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();
            
            console.log("Gonna remove the post, YAY!!");
            console.log("Req", req.xhr);
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'Post deleted'
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    }catch(err){
        // console.log(`Error in deleting the post: ${err}`);
        req.flash('error', err);
        return;
    }
}