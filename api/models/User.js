const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    firstName: {type:String,required:true,min:4},
    lastName:{type:String,required:true,min:4},
    userName:{type:String,required:true,min:4,unique:true},
    password:{type:String,required:true}
})

const UserModel=mongoose.model('User',UserSchema);

module.exports=UserModel;