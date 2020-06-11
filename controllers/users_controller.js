const User = require('../models/user');
// console.log("I am inside users controller");
module.exports.profile = function(req, res){
    console.log("Cookies", req.cookies.user_id);
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){

            if(err){
                console.log("Error in finding the details of the user", err);
                return;
            }

            if(user){
                res.render('user_profile', {
                    title: "User Profile",
                    user: user
                });
            }
        });
    }else{
        return res.redirect('/users/sign-in');
    }
}

//render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

//render sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

//get the sign up data
module.exports.create = function(req, res){
    console.log("details", req.body);
    console.log("create called", req.body.password, req.body.confirm_password);
    if(req.body.password != req.body.confirm_password){
        console.log("I am going here");
        return res.redirect('back');
    }
    console.log("Finding user", User.findOne({email:req.body.email}));
    User.findOne({email:req.body.email}, function(err, user){
        console.log("User: ", user);
        if(err){
            console.log("Error in finding user in signing up"); return;
        }
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log("Error in creating user while signing up"); return;
                }
                console.log("Successfully created the user");
                return res.redirect('/users/sign-in');
            });
        }
        else{
            console.log("User already exists");
            return res.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(req, res){

    //steps to authenticate
    //find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log("Error in creating user while signing in"); return;
        }

        //handle user found 
        if(user){
            //handle password which don't match
            if(user.password != req.body.password){
                return res.redirect('back');
            }

            //handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');

        }
        else{
            //handle user not found
            return res.redirect('back');
        }
    
    });

}