const express=require("express");
const userRoutes=express.Router();
const {registerCtrl,loginCtrl,userDetailsCtrl,userProfileCtrl,userProfilePhotoUploadCtrl,userCoverPhotoUploadCtrl,userPasswordUpdateCtrl,userUpdateCtrl,userLogoutCtrl}=require("../../controllers/users/users.js");
const protected=require("../../middlewares/protected.js");
const storage=require("../../config/cloudinary.js");
const multer=require("multer");

//instance of multer
const upload=multer({storage});

//rendering forms
//------
//login form
userRoutes.get("/login",(req,res)=>{
    res.render("users/login.ejs",{
        error:""
})
});
// register form 
userRoutes.get("/register",(req,res)=>{
    res.render("users/register.ejs",{
        error:""
    })
});

//upload profile photo
userRoutes.get("/upload-profile-photo-form",(req,res)=>{
    res.render("users/uploadProfilePhoto.ejs",{
        error:""
    })
});
//upload cover  photo
userRoutes.get("/upload-cover-photo-form",(req,res)=>{
    res.render("users/uploadCoverPhoto.ejs",{error:''})
});
// Update user form 
/*
userRoutes.get("/updateUser",(req,res)=>{
    res.render("users/updateUser.ejs")
});*/
//password update form
userRoutes.get("/update-password-form",(req,res)=>{
    res.render("users/updatePassword.ejs",{error:""})
});
//register
userRoutes.post("/register",registerCtrl);


userRoutes.post("/login",loginCtrl);


userRoutes.get("/profile-page",protected,userProfileCtrl);

userRoutes.put("/profile-photo-upload",
    protected,
    upload.single("profile"),
    userProfilePhotoUploadCtrl
);

userRoutes.put("/cover-photo-upload/",
    protected,
    upload.single("profile"),
userCoverPhotoUploadCtrl
);

userRoutes.put("/update-password",userPasswordUpdateCtrl);
// to update the user details

userRoutes.put("/update",userUpdateCtrl);

userRoutes.get("/logout",userLogoutCtrl);
//to get details route
userRoutes.get("/:id",userDetailsCtrl);



module.exports=userRoutes;