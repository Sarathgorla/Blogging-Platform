require("dotenv").config();
const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");


// configure cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY

})

//instance of cloudinary storage
const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormats:["jpg","png","jpeg"],
    params:{
        folder:'blog-app-v3',
        transformation:[{width:500,height:500,crop:"limit"}],

    }
});
module.exports=storage;
