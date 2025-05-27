import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer.js"
import {authApi} from "../features/api/authApi.js"
import {courseApi} from "../features/api/courseApi.js"
import {paymentApi} from "../features/api/paymentAPi.js"
import {courseProgressApi} from "../features/api/courseProgress.Api.js"

export const appStore=configureStore({
    reducer:rootReducer,
    middleware:(defaultMiddleware)=>defaultMiddleware().concat(authApi.middleware,courseApi.middleware,paymentApi.middleware,courseProgressApi.middleware)
})

const initializeApp=async ()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{foreceRefetch:true}))
}
initializeApp()