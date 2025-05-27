import {CourseProgress} from '../models/courseProgress.model.js'
import {Course} from '../models/course.model.js'
export const getCourseProgress=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const userId=req.id;
        // fetch course Progress
        let courseProgress=await CourseProgress.findOne({courseId,userId}).populate("courseId")

        const courseDetails=await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                message:"Course not Found"
            })
        }
        //if no progress found return course Details with an empty progress

        if(!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        }
        // return the user's course Progress along with courseDetails
        return res.status(200).json({
            data:{
                courseDetails,
                progress:courseProgress.lectureProgress,
                completed:courseProgress.completed
            }
        })


    }catch(err){
        console.log(err);

    }

}
export const updateLectureProgress=async (req,res)=>{
    try{
        const {courseId,lectureId}=req.params
        const userId=req.id
        //fetch or create course Progress
        let courseProgress=await CourseProgress.findOne({courseId,userId})
        if(!courseProgress){
            //if no progress is exist create a new record 
            courseProgress=new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[],
            })
        }
        // find the lecture progress in the course Progress
        const lectureIdx=courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId===lectureId)

        if(lectureIdx!==-1){
            //if lecture already exist , update it's status 
            courseProgress.lectureProgress[lectureIdx].viewed=true;
        }else{
            //add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true,
            })

        }
        //if all lecture is complete
        const lectureProgressLength= courseProgress.lectureProgress.filter((lectureProg)=>lectureProg.viewed).length

        const course=await Course.findById(courseId);

        if(course.lectures.length===lectureProgressLength) courseProgress.completed=true;

        await courseProgress.save();

        return res.status(200).json({
            message:"Lecture progress updated successfully"
        })
    }catch(err){
        console.log(err);
    }
};

export const markAsCompleted=async (req,res)=>{
    try{
        const {courseId}=req.params;
        const userId=req.id;
        const courseProgress=await CourseProgress.findOne({courseId,userId});
        if(!courseProgress) return res.status(404).json({
            message:"COurse progress not Found"
        })

        courseProgress.lectureProgress.map((lectureProgress)=>{
            lectureProgress.viewed=true
        })
        courseProgress.completed=true

        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as complete."
        })

    }catch(err){
        console.log(err);

    }
}
export const markAsInCompleted=async (req,res)=>{
    try{
        const {courseId}=req.params;
        const userId=req.id;
        const courseProgress=await CourseProgress.findOne({courseId,userId});
        if(!courseProgress) return res.status(404).json({
            message:"COurse progress not Found"
        })

        courseProgress.lectureProgress.map((lectureProgress)=>{
            lectureProgress.viewed=false
        })
        courseProgress.completed=false

        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as Incomplete."
        })

    }catch(err){
        console.log(err);

    }
}