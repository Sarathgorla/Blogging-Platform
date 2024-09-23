const express=require("express");
const commentRoutes=express.Router();
const protected=require("../../middlewares/protected.js");
const { createCommentCtrl,getCommentCtrl,deleteCommentCtrl,updateCommentCtrl}=require("../../controllers/comments/comments.js")
commentRoutes.post("/:id",protected,createCommentCtrl);

commentRoutes.get("/:id",getCommentCtrl);


commentRoutes.delete("/:id",protected,deleteCommentCtrl);

commentRoutes.put("/:id",protected,updateCommentCtrl);




module.exports=commentRoutes;