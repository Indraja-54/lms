import {createSlice} from "@reduxjs/toolkit"
const initialState={
    user:null,
    isAuthenticated:false
}
const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        userLoggedIn:(state,actions)=>{
            state.user=actions.payload.user,
            state.isAuthenticated=true
        },
        userLoggedOut:(state,actions)=>{
            state.user=null,
            state.isAuthenticated=false
        }
    }
})
export const {userLoggedIn,userLoggedOut}=authSlice.actions
export default authSlice.reducer