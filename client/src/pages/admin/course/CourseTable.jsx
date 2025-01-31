import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useGetCourseByIdAndDeleteMutation, useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { DeleteIcon, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useEffect } from 'react'

const CourseTable = () => {
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetCreatorCourseQuery();

    useEffect(() => {
        refetch();
    }, [])
    return (
        <div className='mt-5'>
            <Button onClick={() => navigate("create")}>Create a New Course</Button>
            <Table>
                <TableCaption>A list of your recent Courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">Price</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Title</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.courses.map((course) => (
                        <TableRow key={course?._id}>
                            <TableCell className="font-medium">
                                {course?.coursePrice || "N/A"}
                            </TableCell>
                            <TableCell>
                                <Badge >
                                    {course?.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell>{course?.courseTitle}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => navigate(`${course._id}`)}><Edit /></Button>
                            </TableCell>
                            <TableCell className="text-right">
                                <DeleteDialog id={course._id} />
                            </TableCell>
                        </TableRow>
                    ))

                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CourseTable



const DeleteDialog = ({ id }) => {
    const [getCourseByIdAndDelete, { data, error, isError, isSuccess, isLoading }] = useGetCourseByIdAndDeleteMutation();

    const deleteCourseHandler = async () => {
        await getCourseByIdAndDelete(id);
        toast.success("Course deleted successfully");
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button><DeleteIcon /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="text-white bg-red-500 hover:bg-red-400" onClick={deleteCourseHandler}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}