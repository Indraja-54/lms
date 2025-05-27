import mongoose from "mongoose"

const certificateSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    completionDate: { type: String, required: true },
  });
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["instructor","student"],
        default:"student"
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
    photoUrl:{
        type:String,
        default:""
    },
    certificates: [certificateSchema],
},{timestamps:true});

export const User=mongoose.model("User",userSchema)