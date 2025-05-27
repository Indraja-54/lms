import React,{ useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import {useRegisterUserMutation,useLoginUserMutation} from "@/features/api/authApi.js"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const [signUpInput, setSignUpInput] = useState({ name: "", email: "", password: "" });
    const changeInputHandler=(e,type)=>{
        const {name,value}=e.target;
        if(type==="signup"){
            setSignUpInput({...signUpInput,[name]:value})
        }else{
            setLoginInput({...loginInput,[name]:value})
        }
    }
    const navigate=useNavigate()
    const [registerUser,{
        data:registerData,
        isLoading:registerLoading,
        isError:registerError,
        isSuccess:registerSuccess
    }]=useRegisterUserMutation()
    const [loginUser,{
        data:loginData,
        isLoading:loginLoading,
        isError:loginError,
        isSuccess:loginSuccess
    }]=useLoginUserMutation()

    const handleRegistration=async (type)=>{
        const inputData=type==="signup"?signUpInput:loginInput;
        const action=type==="signup"?registerUser:loginUser;
        await action(inputData)
        console.log(signUpInput)
    }
    useEffect(()=>{
        if(registerSuccess && registerData){
            toast.success(registerData.message||"sign up successfully")
        }
        if(loginSuccess && loginData){
            toast.success(loginData.message||"login successfully")
            navigate("/");
        }

        if(registerError){
            toast.error(registerError?.data?.message)
        }
        if(loginError){
            toast.error(loginError?.data?.message)
        }
        
    },[
        registerLoading,
        loginLoading,
        registerData,
        loginData,
        registerError,
        loginError,
        registerSuccess,
        loginSuccess
    ])


    return (
        <div className="flex items-center w-full justify-center mt-20">
            <Tabs  className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">SignUp</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>SignUp</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you are done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" 
                                value={signUpInput.name} 
                                type="text" 
                                onChange={(e)=> changeInputHandler(e,"signup")} 
                                placeholder="Eg. indhu" required={true} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" 
                                value={signUpInput.email}  
                                onChange={(e)=>changeInputHandler(e,"signup")} 
                                placeholder="indhu@gmail.com" required={true} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" 
                                onChange={(e)=>changeInputHandler(e,"signup")} 
                                name="password" value={signUpInput.password}  
                                required={true} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerLoading}onClick={()=>handleRegistration("signup")}>
                                {
                                    registerLoading?(
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animal-spin"/>please wait
                                    </>):"signup"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here After signup you will be logged in
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" 
                                name="email" value={loginInput.email}
                                onChange={(e)=>changeInputHandler(e,"login")} type="email" placeholder="indhu@gmail.com" required={true} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">password</Label>
                                <Input id="password" name="password" 
                                value={loginInput.password} 
                                onChange={(e)=>changeInputHandler(e,"login")} 
                                type="password" required={true} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginLoading}onClick={()=>handleRegistration("login")}>
                            {
                                    loginLoading?(
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animal-spin"/>please wait
                                    </>):"login"
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default Login