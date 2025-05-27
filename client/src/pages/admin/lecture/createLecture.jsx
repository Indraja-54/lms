import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ArrowLeft, FilePlus, Loader2, UploadCloud, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import Lecture from './Lecture.jsx';
import { useCreateLectureMutation, useGetCourseLectureQuery, useGetCourseByIdQuery } from '@/features/api/courseApi.js';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const CreateLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  
  // State management
  const [lectureFormData, setLectureFormData] = useState({
    lectureTitle: "",
    description: "",
    isPreview: false,
    videoFile: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState("create"); // "create" or "manage"
  
  // API hooks
  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();
  const { 
    data: lectureData, 
    isLoading: lectureLoading, 
    isError: lectureError, 
    refetch 
  } = useGetCourseLectureQuery(courseId, { skip: !courseId });
  const { 
    data: courseData, 
    isLoading: courseLoading 
  } = useGetCourseByIdQuery(courseId, { skip: !courseId });

  // Handle form state changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      setLectureFormData(prev => ({
        ...prev,
        videoFile: files[0]
      }));
    } else {
      setLectureFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!lectureFormData.lectureTitle.trim()) {
      errors.lectureTitle = "Lecture title is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle lecture creation
  const createLectureHandler = async () => {
    if (!validateForm()) return;
    
    // For now, just sending the title and courseId
    // In a real implementation, you would handle file upload
    // Using FormData to send multipart/form-data
    await createLecture({ 
      lectureTitle: lectureFormData.lectureTitle, 
      courseId,
      description: lectureFormData.description,
      isPreview: lectureFormData.isPreview
      // videoFile would be handled with FormData in a real implementation
    });
  };
  
  // Reset form after successful submission
  const resetForm = () => {
    setLectureFormData({
      lectureTitle: "",
      description: "",
      isPreview: false,
      videoFile: null
    });
  };
  
  // Process API responses
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture created successfully");
      refetch();
      resetForm();
    } 
    
    if (error) {
      toast.error(error.data?.message || "Failed to create lecture");
    }
  }, [isSuccess, error, data, refetch]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Lectures</h1>
          <p className="text-muted-foreground">
            {courseLoading ? "Loading course information..." : courseData?.course.courseTitle || "Add and manage lectures for your course"}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          onClick={() => navigate(`/admin/course/${courseId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "create" 
            ? "border-b-2 border-primary text-primary" 
            : "text-muted-foreground"}`}
          onClick={() => setActiveTab("create")}
        >
          Create Lecture
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "manage" 
            ? "border-b-2 border-primary text-primary" 
            : "text-muted-foreground"}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Lectures {lectureData?.lectures.length > 0 && `(${lectureData.lectures.length})`}
        </button>
      </div>
      
      {/* Create Lecture Tab */}
      {activeTab === "create" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FilePlus className="mr-2 h-5 w-5" />
              Add New Lecture
            </CardTitle>
            <CardDescription>
              Create a new lecture for your course. Add a title, description, and optionally mark it as a preview lecture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lectureTitle" className="required-field">Title</Label>
                <Input 
                  id="lectureTitle"
                  type="text" 
                  name="lectureTitle"
                  value={lectureFormData.lectureTitle} 
                  onChange={handleInputChange}
                  placeholder="Enter lecture title"
                  className={formErrors.lectureTitle ? "border-red-500" : ""}
                />
                {formErrors.lectureTitle && (
                  <p className="text-sm text-red-500">{formErrors.lectureTitle}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={lectureFormData.description} 
                  onChange={handleInputChange}
                  placeholder="Describe what students will learn in this lecture"
                  rows={4}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Lecture Video</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <input
                    type="file"
                    id="videoFile"
                    name="videoFile"
                    accept="video/*"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="videoFile" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    {lectureFormData.videoFile ? (
                      <div className="flex flex-col items-center">
                        <Video className="h-10 w-10 text-green-500 mb-2" />
                        <p className="text-sm font-medium">{lectureFormData.videoFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(lectureFormData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setLectureFormData(prev => ({...prev, videoFile: null}));
                          }}
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Drag and drop a video file or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-1">MP4, WebM or MOV up to 500MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isPreview" 
                  name="isPreview"
                  checked={lectureFormData.isPreview}
                  onCheckedChange={(checked) => 
                    setLectureFormData(prev => ({...prev, isPreview: checked}))
                  }
                />
                <Label htmlFor="isPreview">Make this lecture available as a preview</Label>
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>Reset</Button>
                <Button 
                  disabled={isLoading} 
                  onClick={createLectureHandler}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : "Create Lecture"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Manage Lectures Tab */}
      {activeTab === "manage" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Course Lectures
            </CardTitle>
            <CardDescription>
              Manage, reorder, and edit your course lectures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lectureLoading ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Loading lectures...</p>
                <Progress value={80} className="w-full" />
              </div>
            ) : lectureError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load lectures. Please try again later.
                </AlertDescription>
              </Alert>
            ) : !lectureData || lectureData.lectures.length === 0 ? (
              <div className="p-8 text-center">
                <FilePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg mb-1">No lectures yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first lecture to this course.</p>
                <Button onClick={() => setActiveTab("create")}>
                  Add First Lecture
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {lectureData.lectures.map((lecture, index) => (
                    <Lecture 
                      key={lecture._id} 
                      courseId={courseId} 
                      lecture={lecture} 
                      index={index} 
                      onUpdated={refetch}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateLecture;