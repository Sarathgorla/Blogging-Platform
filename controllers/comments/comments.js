const Post=require("../../models/post/Post.js");
const User=require("../../models/user/User.js");
const Comment=require("../../models/comment/Comment.js");
const appErr = require("../../utils/appErr");
//create comment
const createCommentCtrl=async(req,res,next)=>{
  const { message } = req.body;
  try {
    //Find the post
    const post = await Post.findById(req.params.id);
    //create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post:post._id
    });
    //push the comment to post
    post.comments.push(comment._id);
    //find the user
    const user = await User.findById(req.session.userAuth);
    //push the comment into
    user.comments.push(comment._id);
    //disable validation
    //save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error));
  }
};
// single
const getCommentCtrl=async(req,res)=>{
    try {
        const comment=await Comment.findById(req.params.id);
        res.render("comments/updateComment",{
          comment,error:""
        });
      } catch (error) {
        res.redner("comments/updateCmment",{
          error:error.message
        })
      }
  }

 

//to delete comment 
const deleteCommentCtrl=async(req,res,next)=>{
    //console.log(req.query);
  try {
      const comment=await Comment.findById(req.params.id);
      // check if the posts belongs to the user
      if (comment.user.toString()!==req.session.userAuth){
        return next(appErr("You are not alloed to delete this comment",403));

      }
      //delete post
      await Comment.findByIdAndDelete(req.params.id);
        
        res.redirect(`/api/v1/posts/${req.query.postId}`);
      
      } catch (error) {
        return next(appErr(error.message));
      }
}
const updateCommentCtrl=async(req,res,next)=>{
  try {
    // find the comment

    const comment=await Comment.findById(req.params.id);
    if(!comment){
      return next(appErr("Comment not Found"));
    }
    // check if the posts belongs to the user
    if (comment.user.toString()!==req.session.userAuth){
      return next(appErr("You are not alloed to update this comment",400));

    }
      //update
      const commentUpdated=await Comment.findByIdAndUpdate(req.params.id,{
        message:req.body.message
      },{
        new:true
      })
      res.redirect(`/api/v1/posts/${req.query.postId}`);
      } catch (error) {
        next(appErr(error.message));
      }
}

module.exports={
    createCommentCtrl,
    getCommentCtrl,
    deleteCommentCtrl,
    updateCommentCtrl

    
}