import {useParams, Navigate} from "react-router-dom"
import {useGetCourseDetailWithStatusQuery} from "@/features/api/paymentAPi.js"

const PurchaseCourseProtectedRoute=({children})=>{
    const {courseId}=useParams();
    const {data,isLoading}=useGetCourseDetailWithStatusQuery(courseId)

    if(isLoading) return <p>Loading...</p>

    return data?.purchased?children:<Navigate to={`/course-detail/${courseId}`}/>
}

export default PurchaseCourseProtectedRoute;