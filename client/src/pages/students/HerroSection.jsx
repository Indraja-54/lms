import { Input } from '@/components/ui/input';
import React from 'react';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const HerroSection = () => {
  const [searchQuery,setSearchQuery]=useState("")
  const navigate=useNavigate();
  const searchHandler=(e)=>{
    e.preventDefault()
    if(searchQuery.trim()!==""){
      
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("");
  }

  return (
    <div className="">
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-4xl font-bold mb-4">
            Find the Best Courses for You
          </h1>
          <p className="text-gray-200 dark:text-gray-400 mb-8">
            Discover, Learn, and Upskill with our wide range of courses
          </p>
          <form
            onSubmit={searchHandler}
            className="flex items-center bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-full w-full mb-6"
          >
            <Input
              type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
              className="flex-grow border-none focus-visible:ring-0 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base"
              placeholder="Search for courses"
            />
            <button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white px-5 py-2 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 text-base">
              Search
            </button>
          </form>

          <button onClick={()=>navigate(`/course/search?query`)}className="bg-white dark:bg-gray-800 text-blue-600 text-xl rounded-full hover:bg-gray-200 px-6 py-2">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default HerroSection;
