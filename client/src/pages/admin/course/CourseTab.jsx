import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useState, useEffect} from 'react'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button.jsx'
import React from 'react'
import { Label } from "@/components/ui/label";
import {Loader2, BookOpen, BarChart2, Tag, Type, FileText, Calendar, Edit3, Image, DollarSign, AlertTriangle} from 'lucide-react'
import { Input } from "@/components/ui/input";
import CoustomQuill from '@/components/CoustomQuill.jsx';
import {useNavigate} from 'react-router-dom'
import {useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation} from "@/features/api/courseApi.js"
import { useParams } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const CourseTab = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isPublished = "true";
  const courseId = params.courseId
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("")
  const [editCourse, {data, isLoading, isSuccess, error}] = useEditCourseMutation();
  const [publishCourse, {isLoading: publishLoading}] = usePublishCourseMutation()
  const {data: courseByIdData, isLoading: courseByIdLoading, refetch} = useGetCourseByIdQuery(courseId, {refetchOnMountOrArgChange: true});
  
  const changeEventHandler = (e) => {
      const { name, value } = e.target;
      setInput({ ...input, [name]: value });
  };
  
  const selectCategory = (value) => {
      setInput({...input, category: value});
  }
  
  const selectCourseLevel = (value) => {
      setInput({...input, courseLevel: value});
  }

  const selectThumbnail = (e) => {
      const file = e.target.files?.[0]
      if(file) {
          setInput({...input, courseThumbnail: file});
          const fileReader = new FileReader();
          fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
          fileReader.readAsDataURL(file);
      }
  }
  
  const updateCourseHandler = async () => {
      const formData = new FormData();
      formData.append("courseTitle", input.courseTitle)
      formData.append("subTitle", input.subTitle)
      formData.append("description", input.description)
      formData.append("category", input.category)
      formData.append("courseLevel", input.courseLevel)
      formData.append("coursePrice", input.coursePrice)
      formData.append("courseThumbnail", input.courseThumbnail)
      await editCourse({formData, courseId})
  }
  
  const publishStatusHandler = async (action) => {
      try {
          const response = await publishCourse({courseId, query: action})
          if(response.data) {
              refetch();
              toast.success(response.data.message)
          }
      } catch(err) {
          toast.error("Failed to publish or unpublish the course")
      }
  }
  
  useEffect(() => {
      if(courseByIdData?.course) {
          const course = courseByIdData?.course
          setInput({
              courseTitle: course.courseTitle,
              subTitle: course.subTitle,
              description: course.description,
              category: course.category,
              courseLevel: course.courseLevel,
              coursePrice: course.coursePrice,
              courseThumbnail: "",
          })
      }
  }, [courseByIdData])

  useEffect(() => {
      if(isSuccess) {
          toast.success(data.message || "Course updated successfully")
      }
      if(error) {
          toast.error(error.data.message || "Failed to update course")
      }
  }, [isSuccess, error])
  
  if(courseByIdLoading) return (
      <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg font-medium">Loading course details...</span>
      </div>
  )

  return (
      <div className="space-y-6">
          <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">{input.courseTitle || "Course Editor"}</h1>
                  <p className="text-muted-foreground mt-1">Manage your course details and settings</p>
              </div>
              <div className="flex items-center space-x-2">
                  {courseByIdData?.course?.isPublished && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                          Published
                      </Badge>
                  )}
              </div>
          </div>
          
          <Card className="border-t-4 border-t-primary shadow-md">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
                  <div className="space-y-1">
                      <CardTitle className="text-2xl flex items-center">
                          <BookOpen className="mr-2 h-5 w-5 text-primary" />
                          Course Information
                      </CardTitle>
                      <CardDescription className="text-base">
                          Create a compelling course that attracts students
                      </CardDescription>
                  </div>
                  <div className="flex gap-2">
                      <Button 
                          disabled={courseByIdData?.course.lectures?.length === 0} 
                          variant={courseByIdData?.course.isPublished ? "destructive" : "success"}
                          className={`${courseByIdData?.course.isPublished ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                          onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}
                      >
                          {publishLoading ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                              </>
                          ) : courseByIdData?.course.isPublished ? (
                              <>
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Unpublish
                              </>
                          ) : (
                              <>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Publish
                              </>
                          )}
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                          Remove Course
                      </Button>
                  </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                          <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center">
                                  <Type className="h-4 w-4 mr-1 text-primary" />
                                  Course Title
                              </Label>
                              <Input
                                  type="text"
                                  placeholder="Ex: Advanced React Development Masterclass"
                                  name="courseTitle"
                                  value={input.courseTitle}
                                  onChange={(e) => setInput({ ...input, courseTitle: e.target.value })}
                                  className="h-12 text-base"
                              />
                          </div>
                          
                          <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center">
                                  <FileText className="h-4 w-4 mr-1 text-primary" />
                                  Subtitle
                              </Label>
                              <Input
                                  type="text"
                                  placeholder="Ex: Master React from fundamentals to advanced patterns in 8 weeks"
                                  name="subTitle"
                                  value={input.subTitle}
                                  onChange={(e) => setInput({ ...input, subTitle: e.target.value })}
                                  className="h-12 text-base"
                              />
                          </div>
                          
                          <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center">
                                  <Edit3 className="h-4 w-4 mr-1 text-primary" />
                                  Description
                              </Label>
                              <div className="rounded-md border border-input overflow-hidden">
                                  <CoustomQuill input={input} setInput={setInput} />
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                      <Tag className="h-4 w-4 mr-1 text-primary" />
                                      Category
                                  </Label>
                                  <Select onValueChange={selectCategory} value={input.category}>
                                      <SelectTrigger className="h-12 text-base">
                                          <SelectValue placeholder="Select a Category" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80">
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">Development</SelectLabel>
                                              <SelectItem value="Web Development">Web Development</SelectItem>
                                              <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                              <SelectItem value="Game Development">Game Development</SelectItem>
                                              <SelectItem value="Software Development">Software Development</SelectItem>
                                              <SelectItem value="Database Design">Database Design</SelectItem>
                                              <SelectItem value="Programming Languages">Programming Languages</SelectItem>
                                          </SelectGroup>
                                          <Separator className="my-2" />
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">Business</SelectLabel>
                                              <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                                              <SelectItem value="Finance">Finance</SelectItem>
                                              <SelectItem value="Marketing">Marketing</SelectItem>
                                              <SelectItem value="Business Strategy">Business Strategy</SelectItem>
                                              <SelectItem value="Sales">Sales</SelectItem>
                                          </SelectGroup>
                                          <Separator className="my-2" />
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">IT & Software</SelectLabel>
                                              <SelectItem value="IT Certifications">IT Certifications</SelectItem>
                                              <SelectItem value="Network & Security">Network & Security</SelectItem>
                                              <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                                              <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                                          </SelectGroup>
                                          <Separator className="my-2" />
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">Data Science</SelectLabel>
                                              <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                                              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                              <SelectItem value="Data Visualization">Data Visualization</SelectItem>
                                              <SelectItem value="AI">Artificial Intelligence</SelectItem>
                                              <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                                          </SelectGroup>
                                          <Separator className="my-2" />
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">Design</SelectLabel>
                                              <SelectItem value="Web Design">Web Design</SelectItem>
                                              <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                                              <SelectItem value="UX/UI Design">UX/UI Design</SelectItem>
                                              <SelectItem value="3D & Animation">3D & Animation</SelectItem>
                                          </SelectGroup>
                                          <Separator className="my-2" />
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">Marketing</SelectLabel>
                                              <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                              <SelectItem value="Social Media Marketing">Social Media Marketing</SelectItem>
                                              <SelectItem value="Content Marketing">Content Marketing</SelectItem>
                                              <SelectItem value="SEO">SEO</SelectItem>
                                          </SelectGroup>
                                          <Separator className="my-2" />
                                          <SelectGroup>
                                              <SelectLabel className="font-bold">Other Popular Categories</SelectLabel>
                                              <SelectItem value="Photography">Photography</SelectItem>
                                              <SelectItem value="Music">Music</SelectItem>
                                              <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                                              <SelectItem value="Personal Development">Personal Development</SelectItem>
                                              <SelectItem value="Teaching & Academics">Teaching & Academics</SelectItem>
                                              <SelectItem value="Languages">Languages</SelectItem>
                                          </SelectGroup>
                                      </SelectContent>
                                  </Select>
                              </div>
                              
                              <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                      <BarChart2 className="h-4 w-4 mr-1 text-primary" />
                                      Course Level
                                  </Label>
                                  <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
                                      <SelectTrigger className="h-12 text-base">
                                          <SelectValue placeholder="Select a Level" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectGroup>
                                              <SelectItem value="beginner">Beginner</SelectItem>
                                              <SelectItem value="intermediate">Intermediate</SelectItem>
                                              <SelectItem value="advanced">Advanced</SelectItem>
                                              <SelectItem value="all-levels">All Levels</SelectItem>
                                          </SelectGroup>
                                      </SelectContent>
                                  </Select>
                              </div>
                              
                              <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1 text-primary" />
                                      Price (INR)
                                  </Label>
                                  <Input 
                                      type="number" 
                                      name="coursePrice" 
                                      value={input.coursePrice} 
                                      onChange={changeEventHandler} 
                                      placeholder="Ex: 1999" 
                                      className="h-12 text-base"
                                  />
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-6">
                          <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center">
                                  <Image className="h-4 w-4 mr-1 text-primary" />
                                  Course Thumbnail
                              </Label>
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                  <Input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={selectThumbnail}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                  />
                                  <div className="space-y-2">
                                      <Image className="h-8 w-8 mx-auto text-gray-400" />
                                      <div className="text-sm font-medium">
                                          {previewThumbnail ? "Change thumbnail" : "Upload thumbnail"}
                                      </div>
                                      <p className="text-xs text-gray-500">
                                          Recommended size: 1280x720px (16:9)
                                      </p>
                                  </div>
                              </div>
                              
                              {previewThumbnail && (
                                  <div className="mt-4 rounded-lg overflow-hidden border shadow-sm">
                                      <img 
                                          src={previewThumbnail} 
                                          className="w-full aspect-video object-cover" 
                                          alt="Course thumbnail" 
                                      />
                                  </div>
                              )}
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <h3 className="text-sm font-medium text-blue-800 flex items-center mb-2">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Course Status
                              </h3>
                              
                              <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                      <span className="text-gray-600">Lectures</span>
                                      <span className="font-medium">{courseByIdData?.course.lectures?.length || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-600">Status</span>
                                      <span className={`font-medium ${courseByIdData?.course.isPublished ? "text-green-600" : "text-amber-600"}`}>
                                          {courseByIdData?.course.isPublished ? "Published" : "Draft"}
                                      </span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-gray-600">Completion</span>
                                      <span className="font-medium">
                                          {courseByIdData?.course.lectures?.length > 0 ? "Ready to publish" : "Add lectures first"}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </CardContent>
              
              <CardFooter className="bg-muted/20 px-6 py-4 flex justify-between">
                  <Button 
                      variant="outline" 
                      onClick={() => navigate("/admin/course")}
                      className="px-4"
                  >
                      Cancel
                  </Button>
                  <Button 
                      disabled={isLoading} 
                      onClick={updateCourseHandler}
                      className="px-8"
                  >
                      {isLoading ? (
                          <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                          </> 
                      ) : (
                          "Save Changes"
                      )}
                  </Button>
              </CardFooter>
          </Card>
      </div>
  );
};