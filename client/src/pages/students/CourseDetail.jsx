import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  useGetCourseDetailWithStatusQuery,
  useCreatePurchaseMutation,
  useConfirmPurchaseMutation
} from '@/features/api/paymentAPi.js';
import { BadgeInfo, Lock, PlayCircle, CheckCircle, CreditCard, AlertCircle, Loader2, Moon, Sun } from "lucide-react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CourseDetail = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, pending, processing, success, failed
  const [paymentId, setPaymentId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  
  // Query for course details
  const { 
    data, 
    isLoading, 
    isError, 
    refetch: refetchCourseDetails 
  } = useGetCourseDetailWithStatusQuery(courseId);
  
  // Mutations for purchase processing
  const [createPurchase, { isLoading: isCreatingPurchase }] = useCreatePurchaseMutation();
  const [confirmPurchase, { isLoading: isConfirmingPurchase }] = useConfirmPurchaseMutation();

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      <h1>Loading course details...</h1>
    </div>
  );
  
  if (isError) return (
    <div className="flex items-center justify-center h-screen text-red-500 dark:bg-gray-900">
      <AlertCircle className="h-8 w-8 mr-2" />
      <h1>Failed to load course details</h1>
    </div>
  );

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };
  
  const handleBuyCourse = async () => {
    setIsPurchasing(true);
    setPaymentStatus("pending");
    
    try {
      // Create a pending purchase record
      const result = await createPurchase({ courseId }).unwrap();
      
      if (result && result.paymentId) {
        setPaymentId(result.paymentId);
        setPaymentStatus("processing");
        
        // In a real app, you'd redirect to payment gateway here
        // For demo purposes, we'll simulate payment process with a timeout
        setTimeout(() => {
          handleConfirmPayment(result.paymentId);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to create purchase:", error);
      setPaymentStatus("failed");
    }
  };
  
  const handleConfirmPayment = async (paymentIdToConfirm) => {
    try {
      await confirmPurchase(paymentIdToConfirm).unwrap();
      setPaymentStatus("success");
      
      // After successful payment, refetch course details to update UI
      setTimeout(() => {
        refetchCourseDetails();
      }, 1500);
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      setPaymentStatus("failed");
    }
  };
  
  const closePurchaseDialog = () => {
    // Only allow closing if not in the middle of processing
    if (paymentStatus !== "processing") {
      setIsPurchasing(false);
      setPaymentStatus("idle");
      setPaymentId(null);
    }
  };

  // Helper component for payment status display
  const PaymentStatusDisplay = () => {
    switch (paymentStatus) {
      case "pending":
        return (
          <div className="text-center py-4">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-500 dark:text-blue-400" />
            <p className="font-medium dark:text-white">Ready to purchase</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You'll get access to all course content</p>
          </div>
        );
      case "processing":
        return (
          <div className="text-center py-4">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-500 dark:text-blue-400 animate-spin" />
            <p className="font-medium dark:text-white">Processing payment</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we process your payment...</p>
          </div>
        );
      case "success":
        return (
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 dark:text-green-400" />
            <p className="font-medium text-green-600 dark:text-green-400">Payment successful!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You now have full access to all lectures
            </p>
          </div>
        );
      case "failed":
        return (
          <div className="text-center py-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
            <p className="font-medium text-red-600 dark:text-red-400">Payment failed</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              There was an error processing your payment
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 transition-colors duration-200 dark:bg-gray-900">
      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full h-10 w-10 bg-white dark:bg-gray-800 shadow-md"
        >
          {darkMode ? 
            <Sun className="h-5 w-5 text-yellow-500" /> : 
            <Moon className="h-5 w-5 text-blue-700" />
          }
        </Button>
      </div>
      
      {/* Course header */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-[#2D2F31]"} text-white`}>
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle}</h1>
          <p className="text-base md:text-lg">{course?.subtitle || "Master new skills with this course"}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] dark:text-blue-300 underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>

      {/* Course content */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left column - Description & Lectures */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl dark:text-white">Description</h1>
          <div
            className="text-sm dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
          
          {/* Course lectures */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Course Content</CardTitle>
              <CardDescription className="dark:text-gray-400">{course?.lectures?.length} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 text-sm p-2 rounded transition-colors
                    ${purchased || lecture.isPreviewFree ? 
                      "hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer" : ""
                    }
                    dark:text-gray-200
                  `}
                >
                  <span>
                    {purchased || lecture.isPreviewFree ? (
                      <PlayCircle size={16} className="text-blue-500 dark:text-blue-400" />
                    ) : (
                      <Lock size={16} className="text-gray-400 dark:text-gray-500" />
                    )}
                  </span>
                  <div>
                    <p>{lecture.lectureTitle}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {purchased || lecture.isPreviewFree ? "Available" : "Locked"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Video preview & Purchase */}
        <div className="w-full lg:w-1/3">
          <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-lg">
            <CardContent className="p-4 flex flex-col">
              {/* Video preview */}
              <div className="w-full aspect-video mb-4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden shadow-inner">
                {course?.lectures?.length > 0 && course?.lectures[0]?.videoUrl ? (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course?.lectures[0]?.videoUrl}
                    controls={true}
                    light={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle size={48} className="text-gray-400 dark:text-gray-300" />
                  </div>
                )}
              </div>
              
              {/* Course preview title */}
              <h1 className="text-lg font-medium dark:text-white">
                {course?.lectures[0]?.lectureTitle || "Course Preview"}
              </h1>
              
              <Separator className="my-4 dark:bg-gray-700" />
              
              {/* Price info */}
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-lg md:text-xl font-semibold dark:text-white">Course Price</h1>
                <span className="text-xl font-bold dark:text-white">${course?.coursePrice || "49.99"}</span>
              </div>
              
              {/* What you'll get */}
              <div className="mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                <h3 className="text-sm font-medium mb-2 dark:text-white">What you'll get:</h3>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm dark:text-gray-300">
                    <CheckCircle size={14} className="mr-2 text-green-500 dark:text-green-400" />
                    Full lifetime access
                  </li>
                  <li className="flex items-center text-sm dark:text-gray-300">
                    <CheckCircle size={14} className="mr-2 text-green-500 dark:text-green-400" />
                    Access on mobile and desktop
                  </li>
                  <li className="flex items-center text-sm dark:text-gray-300">
                    <CheckCircle size={14} className="mr-2 text-green-500 dark:text-green-400" />
                    All {course?.lectures?.length} lectures
                  </li>
                </ul>
              </div>
            </CardContent>
            
            {/* Purchase or Continue button */}
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button 
                  onClick={handleContinueCourse} 
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                >
                  Continue Course
                </Button>
              ) : (
                <Button 
                  onClick={handleBuyCourse} 
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                >
                  Buy Course
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={isPurchasing} onOpenChange={closePurchaseDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {paymentStatus === "success" ? "Purchase Complete" : "Purchase Course"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {paymentStatus === "success" 
                ? "You now have full access to this course"
                : "Complete your purchase to get access to all lectures"}
            </DialogDescription>
          </DialogHeader>
          
          {/* Payment Status Display */}
          <PaymentStatusDisplay />
          
          <Separator className="dark:bg-gray-700" />
          
          {/* Purchase Details */}
          <div className="space-y-3 py-2">
            <div className="flex justify-between">
              <span className="font-medium dark:text-white">Course:</span>
              <span className="text-right dark:text-gray-300">{course?.courseTitle}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium dark:text-white">Price:</span>
              <span className="font-bold dark:text-white">${course?.coursePrice || "49.99"}</span>
            </div>
            
            {paymentId && (
              <div className="flex justify-between">
                <span className="font-medium dark:text-white">Payment ID:</span>
                <span className="text-sm font-mono dark:text-gray-300">{paymentId}</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <DialogFooter className="sm:justify-between">
            {paymentStatus === "success" ? (
              <Button 
                onClick={() => {
                  closePurchaseDialog();
                  handleContinueCourse();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Start Learning Now
              </Button>
            ) : paymentStatus === "pending" ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={closePurchaseDialog}
                  disabled={isCreatingPurchase}
                  className="sm:w-1/2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBuyCourse}
                  disabled={isCreatingPurchase}
                  className="sm:w-1/2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  {isCreatingPurchase ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </Button>
              </>
            ) : paymentStatus === "processing" ? (
              <Button disabled className="w-full dark:bg-gray-700 dark:text-gray-300">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </Button>
            ) : paymentStatus === "failed" ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={closePurchaseDialog}
                  className="sm:w-1/2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBuyCourse}
                  className="sm:w-1/2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Try Again
                </Button>
              </>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;