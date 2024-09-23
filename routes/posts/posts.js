const express=require("express");
const postRoutes=express.Router();
const protected=require("../../middlewares/protected.js");
const {createPostCtrl,getPostsCtrl,getOnePostCtrl,deletePostCtrl,updatePostCtrl}=require("../../controllers/posts/posts.js");
const multer=require("multer");
const storage=require("../../config/cloudinary.js");
const Post=require("../../models/post/Post.js");
// instance of multer
const upload=multer({
    storage,

})

//post creation form
postRoutes.get("/get-post-form",(req,res)=>{
res.render("posts/addPost.ejs",{error:""});
});

postRoutes.get("/get-form-update/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.render("posts/updatePost",{post,error:""})
    }catch(error){
        res.render("posts/updatePost",{post:"",error:error.message})
    }
});
postRoutes.post("/",protected,upload.single("file"),createPostCtrl);

postRoutes.get("/",getPostsCtrl);

postRoutes.get("/:id",getOnePostCtrl);




postRoutes.delete("/:id",protected,deletePostCtrl);

postRoutes.put("/:id",protected,upload.single("file"),updatePostCtrl);




module.exports=postRoutes;