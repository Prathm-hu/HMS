import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/apiApi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function Login() {

    const [signupInput, setSignupInput] = useState({ name: "", email: "", password: "", })
    const [loginInput, setLoginInput] = useState({ email: "", password: "", })


    const [
        registerUser,
        {
            data: registerData,
            error: registerError,
            isLoading: registerLoading,
            isSuccess: registerSuccess
        }
    ] = useRegisterUserMutation()
    const [
        loginUser,
        { data: loginData,
            error: loginError,
            isLoading: loginLoading,
            isSuccess: loginSuccess
        }
    ] = useLoginUserMutation();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value })
        } else {
            setLoginInput({ ...loginInput, [name]: value })
        }
    }

    const handleRagistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser
        await action(inputData) //we call rtk api like this and pass data from here
        setSignupInput({ name: "", email: "", password: "", })
        setLoginInput({ email: "", password: "", })
    }
    const navigate = useNavigate()

    useEffect(() => {
        if (registerSuccess && registerData) {
            toast.success(registerData.message || "Signup Successfully")
        }
        if (registerError) {
            toast.error(registerError.data.message || "Failed to signup");
        }
        if (loginSuccess && loginData) {
            toast.success(loginData.message || "login Successfully");
            navigate("/")
        }
        if (loginError) {
            toast.error(loginError.data.message || "Failed to login");
        }
    }, [
        registerLoading,
        registerData,
        registerError,
        loginLoading,
        loginData,
        loginError
    ])

    return (
        // when we use this ui library then always set carefully their value attribute for toggle
        <div className="flex justify-center items-center w-full mt-24">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">SignUP</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>SignUP</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter Your Name"
                                    name="name"
                                    value={signupInput.name}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter Your Email"
                                    name="email"
                                    value={signupInput.email}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Your Password"
                                    name="password"
                                    value={signupInput.password}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerLoading} onClick={() => handleRagistration("signup")}>
                                {registerLoading ?
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin">Please Wait</Loader2>
                                    :
                                    "Sign Up"
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
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    name="email"
                                    value={loginInput.email}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    name="password"
                                    value={loginInput.password}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginLoading} onClick={() => handleRagistration("login")}>
                                {loginLoading ?
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin">Please Wait</Loader2>
                                    :
                                    "Login"
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


/*
1.when we user rtk query and we fetched api then that createApi func provide hook of our function that we created in endpoints
and using that hook we can use and use our api's now that hook provide that endpoin func and 3 state like data,error,isloadin


*/