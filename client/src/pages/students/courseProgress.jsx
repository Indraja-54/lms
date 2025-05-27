import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  CirclePlay, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Download, 
  Share2,
  BookOpen,
  Award,
  Calendar,
  Bookmark,
  CheckCheck,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompletedCourseMutation,
  useInCompletedCourseMutation
} from '@/features/api/courseProgress.Api.js';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Certificate from "@/components/Certifications";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const videoRef = useRef(null);
  
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress, { isLoading: updatingProgress }] = useUpdateLectureProgressMutation();
  const [completeCourse, { isLoading: completingCourse, data: markCompleteData, isSuccess: completeSuccess }] = useCompletedCourseMutation();
  const [inCompleteCourse, { isLoading: incompletingCourse, data: markInCompleteData, isSuccess: inCompleteSuccess }] = useInCompletedCourseMutation();
  
  const [currentLecture, setCurrentLecture] = useState(null);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeTab, setActiveTab] = useState('lectures');
  const [userData, setUserData] = useState({
    name: "Student Name",
    email: "student@example.com"
  });

  // Effect for toast notifications
  useEffect(() => {
    if (data?.success) {
      toast.success("Course progress loaded successfully", {
        position: "bottom-right",
        duration: 3000,
        style: { background: "#10b981", color: "white" }
      });
    }
  }, [data]);

// Effect for handling complete/incomplete course success
useEffect(() => {
  if (completeSuccess) {
    toast.success(markCompleteData?.message || "Course marked as completed!", {
      position: "bottom-right",
      duration: 3000,
      style: { background: "#10b981", color: "white" }
    });
    refetch();
    setShowCertificate(true);
  }
  if (inCompleteSuccess) {
    toast.success(markInCompleteData?.message || "Course marked as incomplete", {
      position: "bottom-right",
      duration: 3000,
      style: { background: "#6366f1", color: "white" }
    });
    refetch();
  }
}, [completeSuccess, inCompleteSuccess, markCompleteData, markInCompleteData]);

// Get user data from localStorage or API when component mounts
useEffect(() => {
  try {
    // Assuming user data is stored in localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      // Fallback or fetch from API if needed
      // You could replace this with an API call to get user data
      console.log('No user data found in localStorage');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}, []);

  // Calculate overall course progress
  const calculateOverallProgress = (courseData) => {
    if (!courseData) return 0;
    const { progress, courseDetails } = courseData.data;
    const totalLectures = courseDetails.lectures.length;
    const completedLectures = progress.filter(p => p.viewed).length;
    return Math.round((completedLectures / totalLectures) * 100);
  };

  // Video progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener('timeupdate', updateVideoProgress);
    return () => video.removeEventListener('timeupdate', updateVideoProgress);
  }, [currentLecture]);

  // Format the completion date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format video duration
  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    return duration;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg shadow-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Error Loading Course</h2>
          <p className="mt-4 text-red-600 dark:text-red-400">Unable to load course details. Please try again later.</p>
          <Button onClick={refetch} className="mt-6 bg-red-600 hover:bg-red-700">
            <ArrowRight className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const { courseDetails, progress: progressData, completed } = data.data;
  const { courseTitle, lectures, courseImg, instructor, category } = courseDetails;
  const completionDate = data.data.completedAt ? formatDate(data.data.completedAt) : formatDate(new Date());
  
  if (!lectures || lectures.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20 text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-lg shadow-md">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">No Content Available</h2>
          <p className="mt-4 text-yellow-600 dark:text-yellow-400">This course doesn't have any lectures yet. Check back later.</p>
        </div>
      </div>
    );
  }

  const initialLecture = currentLecture || lectures[0];
  const currentLectureIndex = lectures.findIndex(lecture => lecture._id === (currentLecture?._id || initialLecture?._id));
  const overallProgress = calculateOverallProgress(data);

  const isLectureCompleted = (lectureId) => {
    return progressData.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    if (!isLectureCompleted(lectureId)) {
      await updateLectureProgress({ courseId, lectureId });
      refetch();
    }
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => {
    toast.loading("Updating course status...", { id: "course-status" });
    try {
      await completeCourse(courseId);
      toast.dismiss("course-status");
    } catch (error) {
      toast.error("Failed to update course status", { id: "course-status" });
    }
  };

  const handleInCompleteCourse = async () => {
    toast.loading("Updating course status...", { id: "course-status" });
    try {
      await inCompleteCourse(courseId);
      toast.dismiss("course-status");
    } catch (error) {
      toast.error("Failed to update course status", { id: "course-status" });
    }
  };

  const navigateToPrevious = () => {
    if (currentLectureIndex > 0) {
      handleSelectLecture(lectures[currentLectureIndex - 1]);
    }
  };

  const navigateToNext = () => {
    if (currentLectureIndex < lectures.length - 1) {
      handleSelectLecture(lectures[currentLectureIndex + 1]);
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
    
    if (videoRef.current) {
      videoRef.current.playbackRate = rates[nextIndex];
    }
    toast.success(`Playback speed: ${rates[nextIndex]}x`, {
      position: "bottom-right",
      duration: 1500
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Course Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-end">
            {courseImg && (
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url(${courseImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative p-8 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <Badge className="mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {category || 'Online Course'}
                  </Badge>
                  <h1 className="text-3xl font-bold text-white mb-1">{courseTitle}</h1>
                  <p className="text-gray-200">
                    {instructor ? `By ${instructor}` : 'Online Learning Experience'}
                  </p>
                </div>
                <div>
                  {completed ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1 py-2 px-3">
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center gap-1 py-2 px-3">
                      <Clock className="w-4 h-4 mr-1" />
                      In Progress
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center flex-wrap gap-4 mb-4 sm:mb-0">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                  <span>{lectures.length} lectures</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  <span>{progressData.filter(p => p.viewed).length} completed</span>
                </div>
                
                {completed && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                    <span>Completed on {completionDate}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setShowCertificate(true)}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  disabled={!completed}
                >
                  <Award className="mr-2 h-4 w-4" />
                  {completed ? "View Certificate" : "Complete to Earn Certificate"}
                </Button>
                
                <Button 
                  onClick={completed ? handleInCompleteCourse : handleCompleteCourse} 
                  variant={completed ? "outline" : "default"}
                  className={completed ? 
                    "border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20" : 
                    "bg-blue-600 hover:bg-blue-700 text-white"
                  }
                  disabled={completingCourse || incompletingCourse}
                >
                  {completed ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCheck className="mr-2 h-4 w-4" />
                      <span>Mark as Completed</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Course Progress</span>
                <span>{overallProgress}% Complete</span>
              </div>
              <Progress 
                value={overallProgress} 
                className="h-3 bg-gray-100 dark:bg-gray-700" 
                indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        <Certificate
          userName={userData.name}
          courseTitle={courseTitle}
          completionDate={completionDate}
          isDialogOpen={showCertificate}
          setIsDialogOpen={setShowCertificate}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div 
                className="relative aspect-video bg-black"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  src={currentLecture?.videoUrl || initialLecture?.videoUrl || ''}
                  controls
                  className="w-full h-full"
                  onPlay={() => {
                    const lectureId = currentLecture?._id || initialLecture?._id;
                    if (lectureId) handleLectureProgress(lectureId);
                  }}
                  onEnded={() => {
                    if (currentLectureIndex < lectures.length - 1) {
                      toast.info("Moving to next lecture...", { 
                        duration: 2000,
                        position: "bottom-right"
                      });
                      setTimeout(() => navigateToNext(), 2000);
                    } else {
                      toast.success("Course completed! 🎉", { 
                        duration: 3000,
                        position: "bottom-right"
                      });
                      if (!completed) {
                        setTimeout(() => handleCompleteCourse(), 1000);
                      }
                    }
                  }}
                />
                
                {/* Custom Video Controls */}
                {showControls && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <Progress value={progress} className="h-1 mb-4 bg-white/20" indicatorClassName="bg-blue-500" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={navigateToPrevious} 
                                disabled={currentLectureIndex === 0}
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <ArrowLeft className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Previous Lecture</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={navigateToNext} 
                                disabled={currentLectureIndex === lectures.length - 1}
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <ArrowRight className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Next Lecture</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={changePlaybackRate} 
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{playbackRate}x</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Change Playback Speed</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download Lecture</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Share Lecture</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Info Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge className="mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Lecture {currentLectureIndex + 1} of {lectures.length}
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentLecture?.lectureTitle || initialLecture?.lectureTitle || 'Untitled'}
                    </h2>
                  </div>
                  
                  {isLectureCompleted(currentLecture?._id || initialLecture?._id) && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1 py-2 px-3">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <Tabs defaultValue="details" className="mt-4">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Lecture Details</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="pt-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentLecture?.description || initialLecture?.description || 'No description available for this lecture.'}
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="pt-2">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 italic text-center">
                        You haven't added any notes for this lecture yet.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="pt-2">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 italic text-center">
                        No downloadable resources available for this lecture.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Button
                      onClick={navigateToPrevious}
                      variant="outline"
                      disabled={currentLectureIndex === 0}
                      className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    
                    <Button
                      onClick={navigateToNext}
                      disabled={currentLectureIndex === lectures.length - 1}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Bookmark
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Content */}
          <div className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full">
              <Tabs defaultValue="lectures" className="h-full flex flex-col" onValueChange={setActiveTab}>
                <div className="px-4 pt-4">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="lectures" className="text-sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Lectures
                    </TabsTrigger>
                    <TabsTrigger value="info" className="text-sm">
                      <Award className="w-4 h-4 mr-2" />
                      Course Info
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="lectures" className="flex-grow overflow-hidden flex flex-col p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      Course Content
                    </h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      {progressData.filter(p => p.viewed).length}/{lectures.length} completed
                    </Badge>
                  </div>
                  
                  <ScrollArea className="flex-grow pr-4">
                    <div className="space-y-2">
                      {lectures.map((lecture, index) => (
                        <Card
                          key={lecture._id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-l-4 ${
                            lecture._id === (currentLecture?._id || initialLecture?._id) 
                              ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : isLectureCompleted(lecture._id)
                                ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10'
                                : 'border-l-transparent'
                          }`}
                          onClick={() => handleSelectLecture(lecture)}
                        >
                          <CardContent className="flex items-center p-4 cursor-pointer">
                            <div className="flex items-center flex-1">
                              <div className="mr-3 flex-shrink-0">
                                {isLectureCompleted(lecture._id) ? (
                                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                                  </div>
                                ) : lecture._id === (currentLecture?._id || initialLecture?._id) ? (
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <CirclePlay size={16} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{index + 1}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {lecture.lectureTitle}
                                </CardTitle>
                                {lecture.duration && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {formatDuration(lecture.duration)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <ChevronRight size={16} className="text-gray-400" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="info" className="flex-grow p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">About This Course</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {courseDetails.description || 'Comprehensive learning experience designed to help you master new skills.'}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Course Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total Lectures</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{lectures.length}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {progressData.filter(p => p.viewed).length}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Completion</div>
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">{overallProgress}%</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {completed ? 'Completed' : 'In Progress'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Instructor</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          {instructor ? instructor.charAt(0).toUpperCase() : 'I'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{instructor || 'Course Instructor'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Expert Educator</div>
                        </div>
                      </div>
                    </div>
                    
                    {completed && (
                      <>
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Achievement</h3>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                                <span className="font-medium text-blue-800 dark:text-blue-300">Certificate of Completion</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                onClick={() => setShowCertificate(true)}
                              >
                                View
                              </Button>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center mb-1">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <span>Issued on {completionDate}</span>
                              </div>
                              <div className="flex items-center">
                                <CheckCheck className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <span>All requirements completed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="flex items-center flex-wrap gap-4 mb-4 sm:mb-0">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-28" />
              </div>
              
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Skeleton */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <Skeleton className="w-full aspect-video" />
              
              <div className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="p-4 border rounded-lg flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;