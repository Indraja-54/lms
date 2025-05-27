import React, { useState, useEffect } from 'react';
import Course from './course.jsx';
import { useLoadUserQuery } from '@/features/api/authApi.js';
import { Search, BookOpen, Filter, GraduationCap } from 'lucide-react';

const MyLearning = () => {
  const { data, isLoading, error } = useLoadUserQuery();
  const myLearning = data?.user.enrolledCourses || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'title', 'progress'
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  useEffect(() => {
    if (myLearning.length > 0) {
      let filtered = [...myLearning];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(course => 
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort courses
      switch (sortBy) {
        case 'title':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'progress':
          filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
          break;
        case 'recent':
        default:
          filtered.sort((a, b) => new Date(b.enrolledAt || b.createdAt) - new Date(a.enrolledAt || a.createdAt));
          break;
      }
      
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [myLearning, searchTerm, sortBy]);
  
  // Handle error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-20 px-4 md:px-0">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Error loading courses</h2>
          <p className="mt-2 text-red-600 dark:text-red-300">
            {error.message || "Please try again later or contact support."}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="font-bold text-2xl md:text-3xl">My Learning</h1>
        </div>
        
        {!isLoading && myLearning.length > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{myLearning.length}</span> {myLearning.length === 1 ? 'course' : 'courses'} enrolled
          </div>
        )}
      </div>
      
      {!isLoading && myLearning.length > 0 && (
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        {isLoading ? (
          <MyLearningSkeletons />
        ) : myLearning.length === 0 ? (
          <EmptyLearningState />
        ) : filteredCourses.length === 0 ? (
          <NoSearchResults searchTerm={searchTerm} resetSearch={() => setSearchTerm('')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <Course key={course.id || index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced skeleton loading state
const MyLearningSkeletons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gray-300 dark:bg-gray-700 h-40 animate-pulse"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty state component
const EmptyLearningState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
        <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">You haven't enrolled in any courses yet</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Explore our course catalog and find the perfect learning path for your career goals.
      </p>
      <a 
        href="/courses" 
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
      >
        Browse Courses
      </a>
    </div>
  );
};

// No search results component
const NoSearchResults = ({ searchTerm, resetSearch }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <Search className="h-10 w-10 text-gray-500 dark:text-gray-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">No courses found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        No courses match "<span className="font-medium">{searchTerm}</span>"
      </p>
      <button 
        onClick={resetSearch}
        className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition font-medium"
      >
        Clear Search
      </button>
    </div>
  );
};

export default MyLearning;