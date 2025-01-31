import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/apiApi'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import Course from './Course'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("")
    // remember when we use rtk query and fetch our api's then when we fetch api with mutation then use [] and when use query then use {}
    const { data, isLoading, refetch } = useLoadUserQuery()
    //here we use refetch because when we update any data and we want showt without refresh then use this refetch and fetch updated data
    const [updateUser, { data: updateUserData, isLoading: updateUserLoading, isError: updateUserError, isSuccess: updateUserSuccess }] = useUpdateUserMutation()

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfilePhoto(file);
        }
    }

    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('profilePhoto', profilePhoto);
        await updateUser(formData);
    }

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if (updateUserSuccess) {
            refetch();
            toast.success(data.message || 'Profile updated successfully');
        }
        if (updateUserError) {
            toast.error('Failed to update profile');
        }
    }, [updateUserError, updateUserData, updateUserSuccess])

    const user = data && data.user;

    return (
        <div className='max-w-4xl mx-auto px-4 my-24'>
            <h1 className='font-bold text-2xl text-center md:text-left'>Profile</h1>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
                <div className='flex flex-col items-center'>
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                        <AvatarImage src={user?.photoUrl || './vite.svg'} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Name:
                            <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.name}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Email:
                            <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.email}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Role:
                            <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.role.toUpperCase()}</span>
                        </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mt-2" size="sm">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Makes changes to your profile here. Click save when you're done
                                    </DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4'>
                                    <div className='grid grid-col-4 items-center gap-4'>
                                        <Label>Name</Label>
                                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className="col-span-3" />
                                    </div>
                                    <div className='grid grid-col-4 items-center gap-4'>
                                        <Label>Profile Photo</Label>
                                        <Input type="file" onChange={onChangeHandler} accept="image/*" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button disabled={updateUserLoading} onClick={updateUserHandler}>
                                        {updateUserLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</>
                                            : "Save Changes"
                                        }
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className='font-medium text-xl'>Courses You Are Enrolled</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                    {user?.enrolledCourses?.length == 0 ? <h1>You Haven't Enrolled yet</h1> :
                        user?.enrolledCourses?.map(course => (
                            <Course key={course._id} course={course} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile