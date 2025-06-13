import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from "@/components/ui/switch"
import {Progress} from '@/components/ui/progress'
import React from 'react'
import {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios';
import {toast} from 'sonner'
import {useEditLectureMutation,useRemoveLectureMutation,useGetLectureByIdQuery} from '@/features/api/courseApi.js'
import { Loader2 } from 'lucide-react'
const MEDIA_API="https://lms-4a9c.onrender.com/api/v1/media"
const LectureTab=()=>{
    const [lectureTitle,setLectureTitle]=useState("");
    const [uploadVideoInfo,setUploadVideoInfo]=useState(null);
    const [isFree,setIsFree]=useState(false)
    const [mediaProgress,setMediaProgress]=useState(false);
    const [uploadProgress,setUploadProgress]=useState(0);
    const [btnDisable,setBtnDisable]=useState(true);
    const params=useParams()
    const {courseId,lectureId}=params;
    const [editLecture,{data,isLoading,error,isSuccess}]=useEditLectureMutation()
    const [removeLecture,{data:removeData,isLoading:removeLoading,isSuccess:removeSuccess}]=useRemoveLectureMutation()
    const {data:lectureData,}=useGetLectureByIdQuery()
    const lecture=lectureData?.lecture;
    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();  // fixed
          formData.append("file", file);
          setMediaProgress(true);
          try {
            const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
              onUploadProgress: ({ loaded, total }) => {
                setUploadProgress(Math.round((loaded * 100) / total));
              }
            });
            if (res.data.success) {
              setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.publicId });
              setBtnDisable(false);
              toast.success(res.data.data.message);
            }
          } 
            catch (err) {
                console.error("Upload Error =>", err.response?.data || err.message); 
                toast.error("video upload failed");
              
          } finally {
            setMediaProgress(false);  // fixed
          }
        }
      };
      const editLectureHandler=async ()=>{
        await editLecture({lectureTitle,videoInfo:uploadVideoInfo,isPreviewFree:isFree,courseId,lectureId});
      };
      const deleteLectureHandler=async ()=>{
        await removeLecture(lectureId);

      }
      useEffect(()=>{
        if(lecture){
          setLectureTitle(lecture.lectureTitle)
          setIsFree(lecture.isPreviewFree)
          setUploadVideoInfo(lecture.videoInfo)
        }
      },[lecture])
      useEffect(()=>{
        if(isSuccess){
          toast.success(data.message)
        }
        if(error){
          toast.error(error.data.message)
        }
      },[isSuccess,error]) 
      useEffect(()=>{
        if(removeSuccess)
        {
          toast.success(removeLecture.message)
        }
      },[removeSuccess])
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div className="">
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes and click save when done.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                <Button variant="destructive" onClick={deleteLectureHandler} disabled={removeLoading}>
                  {
                    removeLoading?<>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
                    </>:"Remove Lecture"
                  } 

                </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="">
                    <Label>Title</Label>
                    <Input type="text" value={lectureTitle} onChange={(e)=>setLectureTitle(e.target.value)} placeholder="ex.Introduction to javaScript"
                    />
                </div>
                <div className="my-5">
                    <Label>Video<span className="text-red-500">*</span></Label>
                    <Input type="file" accept="video/*" onChange={fileChangeHandler}placeholder="ex.Introduction to javaScript" className="w-fit"
                    />
                </div>
                <div className="flex items-center space-x-2 my-5">
                <Switch id="airplane-mode" checked={isFree} onCheckedChange={setIsFree} />
                <Label htmlFor="airplane-mode">Is this video is FREE</Label>
                </div>

                {
                    mediaProgress&&<div className="my-4"> <Progress value={uploadProgress}/>
                        <p>{uploadProgress}% uploaded</p>

                    </div>
                }
                <div className="mt-4">
                <Button onClick={editLectureHandler} disabled={isLoading}>
                  {
                    isLoading?<>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>please wait
                    </>:"Update Lecture"
                  }
                  </Button>
                </div>
            </CardContent>
        </Card>

    )
}
export default LectureTab