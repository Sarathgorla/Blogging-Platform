const User=require("../../models/user/User.js");
const bcrypt = require('bcryptjs');
const appErr=require("../../utils/appErr.js");
//register
const registerCtrl=async(req,res,next)=>{
  const { fullname, email, password } = req.body;

  // 1. Check if all fields are provided
  if (!fullname || !email || !password) {
    return res.render("users/register",{
      error:"All fields are required"
    })
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    
      return res.render("users/register",{
        error:"Invalid Email format"
      })
  }

  // 3. Check if password length is less than 8 characters
  if (password.length < 8) {
      return res.render("users/register",{
        error:"Password must be at least 8 characters long"
      
     
    });
  }

  try {
    // 4. Check if user already exists
    const userFound = await User.findOne({ email });
    if (userFound) {
     return res.render("users/register",{
        error:"User Already Exist"
     });
    }
    // 5. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Register the user 
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    //redirect 
    res.redirect("/api/v1/users/profile-page");

  } catch (error) {
    return res.render("users/register",{
      error:"An error occurred while registering the user"
   });
  }
  };

//login 
const loginCtrl=async(req,res,next)=>{
  const {email,password}=req.body;
   // 1. Check if all fields are provided
   if ( !email || !password) {
    return res.render("users/login",{
      error:"All fields are required"
   });
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render("users/login",{
      error:"Invalid email"
   });
    
  }


  try {
      // check if email exist
      const userFound=await User.findOne({email});
      if(!userFound){
        if(userFound){
          return res.render("users/login",{
            error:"Invalid login credentials"
         });
         
        }
      }  
      // verify the password
      const isPasswordValid=await bcrypt.compare(password,userFound.password);
      if(!isPasswordValid){
        if (userFound){
          return res.render("users/login",{
            error:"Invalid login credentials"
         });
        }
      }
      //save the user into the session
      req.session.userAuth=userFound._id
      
      res.redirect("/api/v1/users/profile-page");
      } catch (error) {
        res.render("users/login",{
          error:error.message
        })
      }
}

//details of user
const userDetailsCtrl=async(req,res)=>{
    try {
        // get the user Id from params
        const userId=req.params.id;
        //find the user
        const user=await User.findById(userId).populate("post").populate("comments");
        res.render("users/updateUser", { user, error: null });

      } catch (error) {
        res.render("users/updateUser",{
          user:'',
          error:error.message
        })
      }
}

//profile of user
const userProfileCtrl=async(req,res)=>{
    
    try {
      // get the login user
      const userID=req.session.userAuth;
      // find the user
      const user=await User.findById(userID).populate("posts").populate("comments");
        res.render("users/profile",{user});
      } catch (error) {
        res.render("users/index",{user:"",error:error.message})
      }
}

const userProfilePhotoUploadCtrl=async(req,res,next)=>{
    try {
 
       if(!req.file){
        
       return res.render("users/uploadProfilePhoto",{
        error:"Please upload image"
       })
      }
        //1 . find the user to be updated
        const userId=req.session.userAuth;
        const userFound=await User.findById(userId);
        //2.check if no user found 
        if(!userFound){
         
          return res.render("users/uploadProfilePhoto",{
            error:"User not found"
           })

        }
        // update the user profile
        await User.findByIdAndUpdate(userId,{
          profileImage:req.file.path,
        },
        {
          new:true,
        }
      )

       res.redirect('/api/v1/users/profile-page');
      } catch (error) {
        
        
        return res.render("users/uploadProfilePhoto",{
          error:error.message
         })
      }
}

const userCoverPhotoUploadCtrl=async(req,res,next)=>{
  try {
 
    if(!req.file){
     
    return res.render("users/uploadCoverPhoto",{
     error:"Please upload image"
    })
   }
     //1 . find the user to be updated
     const userId=req.session.userAuth;
     const userFound=await User.findById(userId);
     //2.check if no user found 
     if(!userFound){
      
       return res.render("users/uploadCoverPhoto",{
         error:"User not found"
        })

     }
     // update the user profile
     await User.findByIdAndUpdate(userId,{
       coverImage:req.file.path,
     },
     {
       new:true,
     }
   )

    res.redirect('/api/v1/users/profile-page');
   } catch (error) {
     
     
     return res.render("users/uploadCoverPhoto",{
       error:error.message
      })
   }
}

const userPasswordUpdateCtrl=async(req,res)=>{
    const {password}=req.body

  try {
    // check if the user is updating the password
    if (password.length < 8) {
      return res.render("users/updatePassword",{
        error:"Password must be at least 8 characters long"
      
     
    });
  }
    if(password){
      const salt=await bcrypt.genSalt(10);
      const passwordHashed=await bcrypt.hash(password,salt);
      //update the use
      await User.findByIdAndUpdate(req.session.userAuth,{
        password:passwordHashed
      },{
        new:true
      }
    );
     res.redirect("/api/v1/users/profile-page")
    }
        
      } catch (error) {
       return res.render("users/updatePassword",{
        error:error.message
       })
      }
}

const userUpdateCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  try {
    // Fetch the current user from the session
    const currentUser = await User.findById(req.session.userAuth);

    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "Please provide details",
        user: currentUser, // Retain user information
      });
    }

    // Check if the email is not already taken by another user
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken && emailTaken._id.toString() !== currentUser._id.toString()) {
        return res.render("users/updateUser", {
          user: currentUser, // Retain user information
          error: "Email is already taken",
        });
      }
    }

    // Update the user information
    await User.findByIdAndUpdate(req.session.userAuth, {
      fullname,
      email,
    }, {
      new: true,
    });

    // Redirect to the profile page on successful update
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.render("users/updateUser", {
      error: error.message,
      user: currentUser, // Retain user information in case of an error
    });
  }
};

const userLogoutCtrl=async(req,res)=>{
    try {
        //destroy the session 
        req.session.destroy(()=>{
          res.redirect("/api/v1/users/login");
        });
      } catch (error) {
        res.json(error);
      }

}
module.exports={
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    userProfileCtrl,
    userProfilePhotoUploadCtrl,
    userCoverPhotoUploadCtrl,
    userPasswordUpdateCtrl,
    userUpdateCtrl,
    userLogoutCtrl
}