
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCreateCourseMutation, useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'
const CreateLecture = () => {

    const [lectureTitle, setLectureTitle] = useState("");
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [createLecture, { data, isLoading, error, isSuccess }] = useCreateLectureMutation();
    const { data: lectureData, isLoading: lectureDataLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId)
    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    }

    useEffect(() => {

        if (isSuccess) {
            refetch();
            toast.success(data.message || "Lecture created successfully");
            setLectureTitle("");
            // navigate(`/admin/course/${courseId}/lecture`);
        }
        if (error) {
            toast.error(error.data.message || "Failed to create lecture");
        }

    }, [isSuccess, error])

    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Let's Add Course, Add Some Basic Details For Your New Course</h1>
                <p className='text-gray-400 text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, minima.</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" placeholder="Your Title Name" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>Back to course</Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>
                        {isLoading ?
                            <>
                                <Loader2 className='mr-1 animate-spin h-4 w-4' />
                                Please wait
                            </> :
                            "Create Lecture"
                        }
                    </Button>
                </div>
                <div className='mt-10'>
                    {lectureDataLoading ? <p>Loading Lectures...</p> : lectureError ? <p>Failed to Load Lectures</p> :
                        lectureData.lectures.length === 0 ? <p>No Lecture Available</p> : (
                            lectureData.lectures.map((lecture, index) => <Lecture key={lecture._id} index={index} courseId={courseId} lecture={lecture} />)
                        )

                    }

                </div>
            </div>

        </div>
    )
}

export default CreateLecture