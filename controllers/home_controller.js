const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    console.log("I am going to render the home page");

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

        let users = await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    }catch(err){
        console.log(`Error in rendering the home page: ${err}`);
        return;
    }
};