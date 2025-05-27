import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {useNavigate} from "react-router-dom"
import LectureTab from '@/pages/admin/lecture/LectureTab.jsx'
const EditLecture=()=>{
    const navigate=useNavigate()
    return (
        <div>
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
                <Link to="">
                <Button size='icon' variant='outline' className="rounded-full">
                    <ArrowLeft size={16}/>
                </Button>
                </Link>
                <h1 className="font-bold text-xl">Update your Lecture</h1>
            </div>
        </div>
        <LectureTab/>
        </div>

    )
}
export default EditLecture