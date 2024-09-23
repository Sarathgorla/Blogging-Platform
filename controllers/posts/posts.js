const Post=require("../../models/post/Post.js");
const User=require("../../models/user/User.js");
const appErr=require("../../utils/appErr.js");
//create posts
const createPostCtrl=async(req,res,next)=>{
  const  {title,description,category,user}=req.body;

  try {
    if(!title  || !description || !category || !req.file){
        
      return res.render("posts/addPost",{error:"All fields are reuired"});
    }
    // find the user
      const userId=req.session.userAuth;
      const userFound=await User.findById(userId);
      //create the post
      const postCreated=await Post.create({
          title,
          description,
          category,

          user:userFound._id,
          image:req.file.path
          
      });
      //push the post created into the array of users posts
      userFound.posts.push(postCreated._id);
      //re save the user
      await userFound.save();
       //redirect 
       res.redirect("/");
      } catch (error) {
        return res.render("posts/addPost",{error:"error.message"});
      }
}
// to get all posts 
const getPostsCtrl=async(req,res,next)=>{
    try {
       const posts=await Post.find().populate("comments").populate("user");
        res.json({
          status: "success",
          data:posts
        });
      } catch (error) {
         next(appErr(error.message));
      }
  }

  // to get one post
const getOnePostCtrl=async(req,res,next)=>{
  try {
    // get the id from params
    const id=req.params.id;
    // find the post
    const post=await Post.findById(id).populate({
      path:"comments",
      populate:{
        path:"user"
      }
    }).populate("user");

     res.render("posts/postDetails",{
      post,error:""
     });
   } catch (error) {
      next(appErr(error.message));
   }
}

//to delete post 
const deletePostCtrl=async(req,res,next)=>{
     try {
      const post=await Post.findById(req.params.id);
      // check if the posts belongs to the user
      if (post.user.toString()!==req.session.userAuth){
        
        return res.render("posts/postDetails",{error:"You are not alloed to delete this post",post})
      }
      //delete post
      await Post.findByIdAndDelete(req.params.id);
       res.redirect("/");
      } catch (error) {
        return res.render("posts/postDetails",{error:error.message,post:""})
      }
}
const updatePostCtrl=async(req,res,next)=>{
  const {title,description,category,}=req.body;  
  
  try {
    // find the post 
    const post=await Post.findById(req.params.id);
    // check if the posts belongs to the user
    if (post.user.toString()!==req.session.userAuth){
      return res.render("posts/updatePost",{
        post:"",
        error:"You are not authorized to update this post"
      });
    }
    // check if the user updating image
    if(req.file){
     await Post.findByIdAndUpdate(req.params.id,{
        title,
        description,
        category,
        image:req.file.path
      },{
        new:true
      })
    }else{
    await Post.findByIdAndUpdate(req.params.id,{
        title,
        description,
        category,
      
      },{
        new:true
      })
    }
      //update
      
      
       res.redirect("/")
      }catch (error) {
        return res.render("posts/updatePost",{
          post:"",
          error:error.message
        });
      }
    }

module.exports={
    createPostCtrl,
    getPostsCtrl,
    getOnePostCtrl,
    deletePostCtrl,
    updatePostCtrl
    
}