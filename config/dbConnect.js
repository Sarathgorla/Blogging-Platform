const mongoose=require("mongoose");

const dbConnect=async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Db connected Successfully");
  }catch(error){
    console.log("Db Connection failed",error.message);
  } 
}
dbConnect();
module.exports=dbConnect;