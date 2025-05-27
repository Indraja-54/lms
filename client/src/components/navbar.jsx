import { School } from 'lucide-react'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu, User, LogOut, BookOpen, Settings } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx"
import { useNavigate } from 'react-router-dom';
import  Darkmode  from '../Darkmode'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx"
import { Button } from './ui/button.jsx';
import { Separator } from './ui/separator.jsx';
import { Link } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi.js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  
  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out successfully.");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-2">
          <School size={30} className="text-primary" />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl hover:text-primary transition-colors">
              E-Learning
            </h1>
          </Link>
        </div>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{user?.name?.substring(0, 2)?.toUpperCase() || "UN"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/my-learning")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Learning</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <Darkmode />
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to="/" className="flex items-center gap-2">
          <School size={24} className="text-primary" />
          <h1 className="font-extrabold text-xl">E-Learning</h1>
        </Link>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="flex items-center gap-2">
            <School size={20} />
            <Link to="/">E-Learning</Link>
          </SheetTitle>
          <Darkmode />
        </SheetHeader>
        <Separator className="my-4" />
        
        {user ? (
          <>
            <div className="flex items-center space-x-4 mb-4 p-2 bg-muted/50 rounded-md">
              <Avatar>
                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.substring(0, 2)?.toUpperCase() || "UN"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
            
            <nav className="flex flex-col space-y-3">
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={() => navigate("/my-learning")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Learning
                </Button>
              </SheetClose>
              
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </SheetClose>
              
              <SheetClose asChild>
                <Button variant="ghost" className="justify-start" onClick={logoutHandler}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </SheetClose>
            </nav>
            
            {user?.role === "instructor" && (
              <>
                <Separator className="my-4" />
                <SheetClose asChild>
                  <Button 
                    className="mt-2" 
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </SheetClose>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <SheetClose asChild>
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
            </SheetClose>
            
            <SheetClose asChild>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};