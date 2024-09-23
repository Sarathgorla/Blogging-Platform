const express = require("express");
const session=require("express-session");
const MongoStore=require("connect-mongo")
require("dotenv").config();
require("./config/dbConnect.js");
const globalErrHandler=require("./middlewares/globalHandler.js");
const userRoutes=require("./routes/users/users.js");
const postRoutes=require("./routes/posts/posts.js");
const commentRoutes=require("./routes/comments/comments.js");
const methodOverride=require("method-override");
const Post=require("./models/post/Post");
const app = express();
const {truncatePost}=require("./utils/helpers.js");
//helpers

app.locals.tuncatePost=truncatePost;
//middlewares

app.use(express.json());// pass incoming data
app.use(express.urlencoded({extended:true}));// pass form data
app.set('view engine',"ejs")// configure ejs
app.use(methodOverride("_method"));// to over ride http methods
// serve static files 
app.use(express.static(__dirname+'/public'));
//session configuration
app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitilized:true,
    store:new MongoStore({
        mongoUrl:process.env.MONGO_URL,
        ttl:24*60*60 // 1day
    })
}));
//save the login user into a locals
app.use((req,res,next)=>{
    if(req.session.userAuth){
        res.locals.userAuth=req.session.userAuth
    }else{
        res.locals.userAuth=null
    }
    next();
})
//render home page
app.get("/",async(req,res)=>{
    try{
        const posts=await Post.find().populate("user");
        res.render("index",{posts});
    }catch(error){
        res.render("index",{error:message});

    }
});
// users route
app.use("/api/v1/users",userRoutes);

//-------
//posts route
//------
app.use("/api/v1/posts",postRoutes);
//-------
//comments
//------
app.use("/api/v1/comments",commentRoutes);
//Error handler middlewares

app.use(globalErrHandler);
//listen server
const PORT = process.env.PORT || 1000;
app.listen(PORT, console.log(`Servver is running on PORT ${PORT}`));
