import Navbar from '@/components/navbar'
import { Outlet } from 'react-router-dom'
import React from 'react'

const MainLayout=()=>{
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <div className="flex-1 mt-16">
                <Outlet/>
            </div>
        </div>
    )
}
export default MainLayout