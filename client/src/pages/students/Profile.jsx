import React, { useEffect, useState } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { 
    Loader2, 
    User, 
    Mail, 
    Shield, 
    Camera, 
    Calendar, 
    Edit3, 
    Book, 
    GraduationCap,
    RefreshCw,
    BookOpen,
    Award,
    Plus,
    Trash2,
    Save
} from 'lucide-react'
// import {
//     useGetUserCertificatesQuery,
//     useAddCertificateMutation,
//   } from "@/features/api/authApi";
import Course from './course'
import Certificate from '@/components/Certifications'
import { useLoadUserQuery } from '@/features/api/authApi.js'
import { useUpdateUserMutation } from '@/features/api/authApi.js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

const Profile = () => {
    const { data, isLoading, refetch } = useLoadUserQuery()
    const [name, setName] = useState("")
    const [profilePhoto, setProfilePhoto] = useState("")
    const [previewPhoto, setPreviewPhoto] = useState("")
    const [certificates, setCertificates] = useState([])
    const [updateUser, { 
        data: updateData, 
        isLoading: updateLoading, 
        isError: updateError, 
        isSuccess: updateSuccess 
    }] = useUpdateUserMutation()
    
    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        if (updateSuccess) {
            refetch()
            toast.success(updateData?.message || "Profile updated successfully")
        }
        if (updateError) {
            toast.error(updateError?.data?.message || "Failed to update profile")
        }
    }, [updateError, updateSuccess])

    useEffect(() => {
        if (data?.user) {
            setName(data.user.name || "")
            // Initialize certificates from user data if available
            setCertificates(data.user.certificates || [])
        }
    }, [data])

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfilePhoto(file)
            
            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewPhoto(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const addCertificate = () => {
        setCertificates([
            ...certificates,
            { 
                name: "", 
                issuer: "", 
                issueDate: "", 
                credentialId: "",
                url: ""
            }
        ])
    }

    const removeCertificate = (index) => {
        setCertificates(certificates.filter((_, i) => i !== index))
    }

    const updateCertificate = (index, field, value) => {
        const updatedCertificates = [...certificates]
        updatedCertificates[index][field] = value
        setCertificates(updatedCertificates)
    }

    const UpdateUserHandler = async () => {
        const formdata = new FormData()
        formdata.append("name", name)
        if (profilePhoto) {
            formdata.append("profilePhoto", profilePhoto)
        }
        
        // Add certificates to formdata
        formdata.append("certificates", JSON.stringify(certificates))
        
        try {
            await updateUser(formdata).unwrap()
        } catch (err) {
            console.error("Update failed:", err)
        }
    }

    if (isLoading || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-opacity-20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <h2 className="mt-8 text-xl font-medium text-gray-700 dark:text-gray-300">Loading your profile...</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Please wait while we fetch your information</p>
            </div>
        )
    }

    const { user } = data
    
    // Calculate enrollment stats
    const totalCourses = user.enrolledCourses.length
    const completedCourses = user.enrolledCourses.filter(course => course.completed).length
    const completionPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0
    
    // Get account creation date formatted
    const accountCreated = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // Count user's additional certificates (not from courses)
    const additionalCertificates = user.certificates?.length || 0
    const totalCertificates = completedCourses + additionalCertificates

    return (
        <div className="py-10 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left sidebar */}
                <div className="w-full md:w-80">
                    <Card className="border-t-4 border-t-primary shadow-md sticky top-20">
                        <CardHeader className="pb-3">
                            <div className="flex flex-col items-center mb-4 pt-2">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} alt={user.name} />
                                    <AvatarFallback className="bg-primary text-lg">
                                        {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-bold mt-4">{user.name}</h2>
                                <Badge variant="outline" className="mt-1">
                                    {user.role.toUpperCase()}
                                </Badge>
                            </div>
                            <Separator className="my-2" />
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate" title={user.email}>
                                    {user.email}
                                </span>
                            </div>
                            
                            <div className="flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                                </span>
                            </div>

                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Joined {accountCreated}
                                </span>
                            </div>
                            
                            <Separator className="my-2" />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Enrolled Courses</span>
                                    <Badge variant="secondary">{user.enrolledCourses.length}</Badge>
                                </div>
                                
                                {totalCourses > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <span>Progress</span>
                                            <span>{completionPercentage}%</span>
                                        </div>
                                        <Progress value={completionPercentage} className="h-2" />
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Certificates</span>
                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                        {totalCertificates}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                        
                        <CardFooter className="pt-0">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="w-full">
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center">
                                            <User className="h-5 w-5 mr-2 text-primary" />
                                            Edit Profile
                                        </DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile information below.
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <ScrollArea className="h-[450px] pr-4">
                                        <div className="grid gap-6 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">Name</Label>
                                                <Input 
                                                    type="text" 
                                                    placeholder="Your name" 
                                                    onChange={(e) => setName(e.target.value)} 
                                                    value={name}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label className="text-right">Profile Photo</Label>
                                                <div className="col-span-3 space-y-3">
                                                    <Input 
                                                        type="file" 
                                                        accept="image/*"
                                                        className="file:bg-primary/10 file:text-primary file:border-0 file:font-medium file:mr-4 file:py-1 file:px-3 file:rounded-md"
                                                        onChange={onChangeHandler}
                                                    />
                                                    
                                                    {previewPhoto && (
                                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                                                            <img 
                                                                src={previewPhoto} 
                                                                alt="Profile preview" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <Separator className="my-2" />
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-sm font-medium flex items-center">
                                                        <Award className="h-4 w-4 mr-2 text-yellow-500" />
                                                        External Certificates
                                                    </h4>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={addCertificate}
                                                    >
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Add Certificate
                                                    </Button>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {certificates.length === 0 ? (
                                                        <div className="text-center py-4 text-sm text-gray-500">
                                                            No external certificates added yet.
                                                        </div>
                                                    ) : (
                                                        <Accordion type="multiple" className="w-full">
                                                            {certificates.map((cert, index) => (
                                                                <AccordionItem 
                                                                    value={`item-${index}`} 
                                                                    key={index}
                                                                    className="border rounded-lg px-2 border-gray-200 dark:border-gray-700 mb-3"
                                                                >
                                                                    <AccordionTrigger className="py-3 hover:no-underline">
                                                                        <div className="flex items-center">
                                                                            <Award className="h-4 w-4 mr-2 text-yellow-500" />
                                                                            <span>{cert.name || "New Certificate"}</span>
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="pb-4 pt-2">
                                                                        <div className="space-y-3">
                                                                            <div className="grid grid-cols-3 gap-3">
                                                                                <div>
                                                                                    <Label>Certificate Name</Label>
                                                                                    <Input 
                                                                                        value={cert.name} 
                                                                                        onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                                                                                        placeholder="e.g. Advanced Web Development"
                                                                                        className="mt-1"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label>Issuing Organization</Label>
                                                                                    <Input 
                                                                                        value={cert.issuer} 
                                                                                        onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                                                                                        placeholder="e.g. Coursera, Udacity"
                                                                                        className="mt-1"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label>Issue Date</Label>
                                                                                    <Input 
                                                                                        type="date"
                                                                                        value={cert.issueDate} 
                                                                                        onChange={(e) => updateCertificate(index, 'issueDate', e.target.value)}
                                                                                        className="mt-1"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="grid grid-cols-2 gap-3">
                                                                                <div>
                                                                                    <Label>Credential ID</Label>
                                                                                    <Input 
                                                                                        value={cert.credentialId} 
                                                                                        onChange={(e) => updateCertificate(index, 'credentialId', e.target.value)}
                                                                                        placeholder="Optional credential identifier"
                                                                                        className="mt-1"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label>Certificate URL</Label>
                                                                                    <Input 
                                                                                        value={cert.url} 
                                                                                        onChange={(e) => updateCertificate(index, 'url', e.target.value)}
                                                                                        placeholder="https://..."
                                                                                        className="mt-1"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div>
                                                                                <Label>Description (Optional)</Label>
                                                                                <Textarea 
                                                                                    value={cert.description || ''} 
                                                                                    onChange={(e) => updateCertificate(index, 'description', e.target.value)}
                                                                                    placeholder="Brief description of what you learned..."
                                                                                    className="mt-1"
                                                                                    rows={3}
                                                                                />
                                                                            </div>
                                                                            
                                                                            <div className="flex justify-end">
                                                                                <Button 
                                                                                    variant="destructive" 
                                                                                    size="sm"
                                                                                    onClick={() => removeCertificate(index)}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                                                    Remove
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            ))}
                                                        </Accordion>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                    
                                    <DialogFooter>
                                        <Button 
                                            disabled={updateLoading} 
                                            onClick={UpdateUserHandler}
                                            className="w-full sm:w-auto"
                                        >
                                            {updateLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 w-4 h-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                </div>
                
                {/* Main content area */}
                <div className="flex-1">
                    <Tabs defaultValue="enrolled" className="w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                            <TabsList>
                                <TabsTrigger value="enrolled" className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    Enrolled Courses
                                </TabsTrigger>
                                <TabsTrigger value="completed" className="flex items-center">
                                    <GraduationCap className="h-4 w-4 mr-1" />
                                    Completed
                                </TabsTrigger>
                                <TabsTrigger value="certificates" className="flex items-center">
                                    <Award className="h-4 w-4 mr-1" />
                                    Certificates
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <TabsContent value="enrolled" className="mt-0">
                            <Card>
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center text-xl">
                                        <Book className="h-5 w-5 mr-2 text-primary" />
                                        My Learning Journey
                                    </CardTitle>
                                    <CardDescription>
                                        Courses you've enrolled in to enhance your skills.
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="px-6">
                                    {user.enrolledCourses.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                                <Book className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
                                            <p className="text-muted-foreground max-w-md">
                                                You haven't enrolled in any courses yet. Browse our catalog to find courses that match your interests.
                                            </p>
                                            <Button className="mt-6">
                                                Browse Courses
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                                            {user.enrolledCourses.map((course) => (
                                                <Course course={course} key={course._id} />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="completed" className="mt-0">
                            <Card>
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center text-xl">
                                        <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                                        Completed Courses
                                    </CardTitle>
                                    <CardDescription>
                                        Courses you've successfully completed.
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="px-6">
                                    {completedCourses === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                                <GraduationCap className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No completed courses</h3>
                                            <p className="text-muted-foreground max-w-md">
                                                You haven't completed any courses yet. Keep learning and you'll see your achievements here.
                                            </p>
                                            {totalCourses > 0 && (
                                                <Button className="mt-6" variant="outline">
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Continue Learning
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                                            {user.enrolledCourses
                                                .filter(course => course.completed)
                                                .map((course) => (
                                                    <Course course={course} key={course._id} />
                                                ))
                                            }
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Certificates Tab */}
                        <TabsContent value="certificates" className="mt-0">
                            <Card>
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center text-xl">
                                        <Award className="h-5 w-5 mr-2 text-yellow-500" />
                                        My Certificates
                                    </CardTitle>
                                    <CardDescription>
                                        Certificates you've earned from completed courses and external certifications.
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent className="px-6">
                                    {totalCertificates === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                                <Award className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
                                            <p className="text-muted-foreground max-w-md">
                                                Complete courses to earn certificates or add external certifications from the Edit Profile section.
                                            </p>
                                            <div className="flex gap-4 mt-6">
                                                {totalCourses > 0 && (
                                                    <Button variant="outline">
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        Continue Learning
                                                    </Button>
                                                )}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button>
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Certificate
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[600px]">
                                                        {/* Reuse the edit profile dialog content */}
                                                        <DialogHeader>
                                                            <DialogTitle className="flex items-center">
                                                                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                                                                Add Certificate
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Add your external certificates to showcase your achievements.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        
                                                        {/* Same certificate form fields as in the Edit Profile dialog */}
                                                        {/* ... */}
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Course certificates section */}
                                            {completedCourses > 0 && (
                                                <div className="mb-8">
                                                    <h3 className="text-lg font-medium mb-4 flex items-center">
                                                        <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                                                        Course Certificates
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                                                        {user.enrolledCourses
                                                            .filter(course => course.completed)
                                                            .map((course) => (
                                                                <Certificate 
                                                                    course={course} 
                                                                    user={user} 
                                                                    key={`certificate-${course._id}`} 
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* External certificates section */}
                                            {user.certificates && user.certificates.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-medium mb-4 flex items-center">
                                                        <Award className="h-5 w-5 mr-2 text-yellow-500" />
                                                        External Certificates
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                                                        {user.certificates.map((cert, index) => (
                                                            <Card key={`ext-cert-${index}`} className="overflow-hidden border-t-4 border-t-yellow-500">
                                                                <CardHeader className="pb-2">
                                                                    <div className="flex justify-between items-start">
                                                                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                                            External
                                                                        </Badge>
                                                                    </div>
                                                                    <CardDescription>{cert.issuer}</CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="pb-4">
                                                                    <div className="space-y-2 text-sm">
                                                                        {cert.issueDate && (
                                                                            <div className="flex items-center">
                                                                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                                                                <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                                                                            </div>
                                                                        )}
                                                                        {cert.credentialId && (
                                                                            <div className="flex items-center">
                                                                                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                                                                                <span>ID: {cert.credentialId}</span>
                                                                            </div>
                                                                        )}
                                                                        {cert.description && (
                                                                            <div className="mt-2">
                                                                                <p className="text-gray-600 dark:text-gray-300">{cert.description}</p>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {cert.url && (
                                                                            <div className="mt-3">
                                                                                <Button 
                                                                                    size="sm"
                                                                                    variant="outline" 
                                                                                    className="w-full"
                                                                                    asChild
                                                                                >
                                                                                    <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                                                                        View Certificate
                                                                                    </a>
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex justify-center mt-4">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline">
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Add Certificate
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[600px]">
                                                                <DialogHeader>
                                                                    <DialogTitle className="flex items-center">
                                                                        <Award className="h-5 w-5 mr-2 text-yellow-500" />
                                                                        Add Certificate
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Add your external certificates to showcase your achievements.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                
                                                                <div className="py-4">
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label>Certificate Name</Label>
                                                                                <Input 
                                                                                    placeholder="e.g. Advanced Web Development"
                                                                                    className="mt-1"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label>Issuing Organization</Label>
                                                                                <Input 
                                                                                    placeholder="e.g. Coursera, Udacity"
                                                                                    className="mt-1"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label>Issue Date</Label>
                                                                                <Input 
                                                                                    type="date"
                                                                                    className="mt-1"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label>Credential ID</Label>
                                                                                <Input 
                                                                                    placeholder="Optional credential identifier"
                                                                                    className="mt-1"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <Label>Certificate URL</Label>
                                                                            <Input 
                                                                                placeholder="https://..."
                                                                                className="mt-1"
                                                                            />
                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <Label>Description (Optional)</Label>
                                                                            <Textarea 
                                                                                placeholder="Brief description of what you learned..."
                                                                                className="mt-1"
                                                                                rows={3}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <DialogFooter>
                                                                    <Button 
                                                                        onClick={() => {
                                                                            // This would typically add the certificate and update
                                                                            // For now we'll just close the dialog
                                                                            document.querySelector('[role="dialog"]')?.close();
                                                                        }}
                                                                    >
                                                                        <Save className="mr-2 w-4 h-4" />
                                                                        Add Certificate
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

// Custom label component for the dialog
const Label = ({ className, children, ...props }) => {
    return (
        <label
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
            {...props}
        >
            {children}
        </label>
    )
}

export default Profile