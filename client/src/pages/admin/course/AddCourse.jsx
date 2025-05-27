import { Label} from '@/components/ui/label'
import { Input } from "@/components/ui/input"
import {useCreateCourseMutation,useGetCreatorCourseQuery} from "@/features/api/courseApi.js"
import React from 'react'
import {toast} from 'sonner'
import {useState,useEffect} from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {useNavigate} from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
const AddCourse=()=>{
    const [courseTitle,setCourseTitle]=useState("");
    const [category,setCategory]=useState("");
    const [createCourse,{data,isLoading,error,isSuccess}]=useCreateCourseMutation()
    const {refetch}=useGetCreatorCourseQuery()
    const navigate=useNavigate()

    const getSelectedCategory=(value)=>{
        setCategory(value)
    }
    const createCourseHandler=async ()=>{
        await createCourse({
            courseTitle,category
        })
    }
    useEffect(()=>{
        if(isSuccess){
            console.log("Courses Length:", data?.courses?.length);
            toast.success(data?.message||"course created")
            refetch()
            navigate("/admin/course")
        }

    },[isSuccess,error])
    return (
        <div className="flex-1 mx-10"><div className="mb-4">
        <h1 className="font-bold text-xl">Lets add couse,add some basic course details for your new Course</h1>
        <p className="text-sm">lorem dfoienfjs ejjrijkskfkj skfjsjkfjskdfklsfksfksfksndfknkfnnfjrreojoerijfkrfknkfjnakjfnknfna </p>
        </div>
        <div className="space-y-4">
            <div className="">
                <Label>Title</Label>
                <Input type="text" name="courseTitle" 
                value={courseTitle} onChange={(e)=>setCourseTitle(e.target.value)} 
                placeholder="your Course Name"></Input>
            </div>
            <div className="">
                <Label>Category</Label>
                <Select onValueChange={getSelectedCategory}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          <SelectItem value="Next.js">Next.js</SelectItem>
          <SelectItem value="DataScience">DataScience</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
            </div>
            <div className=" flext items-center gap-2">
                <Button variant="outline" onClick={()=>navigate("/admin/course")}>Back</Button>
                <Button disabled={isLoading} onClick={createCourseHandler}>
                    {
                    isLoading?(
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>please wait
                    </>):"Create"
}
                </Button>
            </div>
        </div>
        </div>

    )
}
export default AddCourse