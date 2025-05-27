import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const COURSE_PROGRESS_URL="https://lmsb.vercel.app/api/v1/progress"
export const courseProgressApi=createApi({
    reducerPath:"courseProgressApi",
    baseQuery:fetchBaseQuery({
        baseUrl:COURSE_PROGRESS_URL,
        credentials: 'include',
    }),
    endpoints:(builder)=>({
        getCourseProgress:builder.query({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:"GET"
            })
        }),
        updateLectureProgress:builder.mutation({
            query:({courseId,lectureId})=>({
                url:`/${courseId}/lecture/${lectureId}/view`,
                method:"POST"
            })
        }),
        completedCourse:builder.mutation({
            query:(courseId)=>({
                url:`${courseId}/complete`,
                method:"POST"
            })
        }),
        inCompletedCourse:builder.mutation({
            query:(courseId)=>({
                url:`${courseId}/incomplete`,
                method:"POST"
            })
        }),
    })
})

export const {useGetCourseProgressQuery,
    useUpdateLectureProgressMutation,
    useCompletedCourseMutation,
    useInCompletedCourseMutation

}=courseProgressApi