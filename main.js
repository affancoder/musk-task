const app = require("express")();
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const PORT = 8080;

const session = require('express-session');
app.use(express.static(path.join(__dirname,"/public/")))
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(session({
    secret:"keyboard cat",
    resave: false,
    saveUninitialized:true,
}));

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.Google_ClientID,
    clientSecret: process.env.Google_ClientSecret,
    callbackURL:`${process.env.GOOGLE_CALLBACK}/auth/google/callback`
},
    function(accessToken,refreshToken,profile,done){
        console.log(profile);
        return done(null,profile);
    }
));

passport.serializeUser(function(user,done){
    done(null,user);
});

passport.deserializeUser(function(user,done){
    done(null,user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google',{scope:["https://www.googleapis.com/auth/plus.login"]})
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/home');
    }
);

app.get("/",(req,res)=>{
    res.render("login.ejs");
});
app.get("/home",(req,res)=>{
    res.render("home.ejs");
});

app.listen(PORT,()=>{
    console.log(`Server is listening at Port:${PORT}`);
})


