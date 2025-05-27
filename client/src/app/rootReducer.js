import {combineReducers} from "@reduxjs/toolkit"
import {authApi} from "../features/api/authApi.js"
import authReducer from "../features/authSlice.js"
import {courseApi} from "@/features/api/courseApi.js"
import { paymentApi } from '../features/api/paymentAPi.js';
import {courseProgressApi} from '../features/api/courseProgress.Api.js'

const rootReducer=combineReducers({
    auth:authReducer,
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer
})
export default rootReducer