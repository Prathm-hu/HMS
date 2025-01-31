import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import DarkMode from '@/DarkMode'
import { useLogoutUserMutation } from "@/features/api/apiApi"
import { Menu, School } from 'lucide-react'
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
const Navbar = () => {

    const { user } = useSelector(store => store.auth)

    const navigate = useNavigate()
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

    const logoutHandler = async () => {
        await logoutUser();
        navigate("/login")
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Logout Success");
        }
    }, [isSuccess])

    return (

        <div className='h-16 dark:bg-[#0a0a0a] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* desktop ui */}
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
                <div className='flex gap-2'>
                    <School size={"30"} />
                    <Link to="/">
                        <h1 className='hidden md:block font-extrabold text-2xl'>E-learning</h1>
                    </Link>
                </div>

                {/* user icon and dark icon */}
                <div className='flex items-center gap-8'>
                    {user ?

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link to={"/my-learning"}>My Learning</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to={"profile"}>Edit Profile</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuItem onClick={logoutHandler}>
                                    Log out
                                </DropdownMenuItem>
                                {user.role === "instructor" && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link to={"/admin/dashboard"}>DashBoard</Link>
                                        </DropdownMenuItem>
                                    </>
                                )
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        :
                        <div className='flex gap-4'>
                            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                            <Button onClick={() => navigate("/login")}>SignUp</Button>
                        </div>
                    }
                    <DarkMode />
                </div>
            </div>

            {/* mobile device */}
            <div className="flex md:hidden h-full items-center justify-between px-4">
                <h1 className="font-extrabold text-2xl">E-Learning</h1>
                <MobileNavbar user={user} />
            </div>
        </div>
    )
}

export default Navbar

const MobileNavbar = ({ user }) => {

    const navigate = useNavigate()
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-slate-300">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle><Link to={"/"}>E-learning</Link></SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                    <Link to={"/my-learning"}>My Learning</Link>
                    <Link to={"/profile"}>Edit Profile</Link>
                    <p>Log Out</p>
                </nav>
                {user?.role === "instructor" && (
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => navigate("admin/dashboard")}>DashBoard</Button>
                        </SheetClose>
                    </SheetFooter>

                )
                }
            </SheetContent>
        </Sheet>
    )

}