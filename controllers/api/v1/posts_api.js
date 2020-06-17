const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });
    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into strings
        if(post.user == req.user.id){
            post.remove();
            
            console.log("Gonna remove the post, YAY!!");
            console.log("Req", req.xhr);
            await Comment.deleteMany({post: req.params.id});

            // req.flash('success', 'Post and associated comments deleted!');
            return res.json(200, {
                message: "Post and associated comments deleted succesfully"
            });
        }
        else{
            // req.flash('error', 'You cannot delete this post');
            return res.json(401, {
                message: "You cannot delete this post"
            });
        }
    }catch(err){
        // console.log(`Error in deleting the post: ${err}`);
        // req.flash('error', err);
        return res.json(500, {
            message: "internal server error"
        });
    }
}