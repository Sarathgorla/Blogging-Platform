const appErr=require("../utils/appErr.js");
const protected=(req,res,next)=>{
    //check if the user is login
    if(req.session.userAuth){
        next();
    }else{
        res.render("users/notAuthorize.ejs")
}}
module.exports=protected;