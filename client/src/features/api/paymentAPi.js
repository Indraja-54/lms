import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const paymentApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // 1. Create a new purchase (status = pending)
    createPurchase: builder.mutation({
      query: ({ courseId }) => ({
        url: "/create",
        method: "POST",
        body: { courseId},
      }),
    }),

    // 2. Confirm a purchase
    confirmPurchase: builder.mutation({
      query: (paymentId) => ({
        url: `/confirm/${paymentId}`,
        method: "PUT",
      }),
    }),

    // 3. Mark purchase as failed
    failPurchase: builder.mutation({
      query: (paymentId) => ({
        url: `/fail/${paymentId}`,
        method: "PUT",
      }),
    }),

    // 4. Get course detail + purchase status
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    // 5. Get all completed purchased courses
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
    getPendingPurchase: builder.query({
      query: (courseId) => ({
        url: `/pending/${courseId}`,
        method: "GET",
      }),
    }),
    
  }),
});

export const {
  useCreatePurchaseMutation,
  useConfirmPurchaseMutation,
  useFailPurchaseMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
  useGetPendingPurchaseQuery,
} = paymentApi;
