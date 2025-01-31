import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompletedCourseMutation, useGetCourseProgressQuery, useInCompletedCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi'
import axios from 'axios'
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'


const CourseProgress = () => {

    const { courseId } = useParams();
    const { data, isLoading, isError, error, refetch } = useGetCourseProgressQuery(courseId);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [updateLectureProgress] = useUpdateLectureProgressMutation();
    const [completedCourse, { data: markCompleteData, isSuccess: completedSuccess, }] = useCompletedCourseMutation();
    const [inCompletedCourse, { data: markInCompleteData, isSuccess: inCompleteSuccess }] = useInCompletedCourseMutation();

    useEffect(() => {
        if (completedSuccess) {
            refetch()
            toast.success(markCompleteData.message)
        }
        if (inCompleteSuccess) {
            refetch()
            toast.success(markInCompleteData.message)
        }
    }, [completedSuccess, inCompleteSuccess])
    if (isLoading) return <p className='mt-24'>Loading...</p>
    if (error) {
        console.log("error status:", error.status)
        console.log("error data:", error.data)
    }
    const { courseDetails, progress, completed } = data?.data;
    const { courseTitle } = courseDetails;
    // initialize the  first lecture is not exist
    const initialLecture = currentLecture || courseDetails?.lectures && courseDetails?.lectures[0]

    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
    }

    const handleLectureProgress = async (lectureId) => {
        await updateLectureProgress({ courseId, lectureId });
        refetch();
    }

    // handle select a specific lecture to watch
    const handleSelectLecture = (lecture) => {
        // setCurrentLecture(courseDetails?.lectures?.find((lect) => lect._id === lectureId))
        setCurrentLecture(lecture);
        handleLectureProgress(lecture?._id)
    }

    const handleCompleteCourse = async () => {
        await completedCourse(courseId)
    }
    const handleInCompleteCourse = async () => {
        await inCompletedCourse(courseId)
    }

    return (
        <div className='max-w-7xl mx-auto p-4 mt-20'>
            {/* display course name */}
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl font-bold'>Course Title</h1>
                <Button onClick={completed ? handleInCompleteCourse : handleCompleteCourse} variant={completed ? "outline" : "default"}>
                    {completed ? <div className='flex items-center'><CheckCircle className='mr-2' /> <span>Completed</span></div> : "Marked as completed"}
                </Button>
            </div>
            <div className='flex flex-col md:flex-row gap-6'>
                {/* video session */}
                <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                    <div>
                        <video src={currentLecture?.videoUrl || initialLecture.videoUrl} controls className='w-full h-auto md:rounded-lg' onPlay={() => handleLectureProgress(currentLecture?._id || initialLecture._id)}
                        />
                    </div>
                    {/* display current watching lecture title */}
                    <div className='mt-2'>
                        <h3 className='font-medium text-lg'>
                            {
                                `lecture ${courseDetails?.lectures.findIndex((lect) => lect._id == (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`
                            }
                        </h3>
                    </div>
                </div>
                {/* lecture sidebar */}
                <div className='flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
                    <h2 className='font-semibold text-xl mb-4'>course Lecture</h2>
                    <div className='flex-1 overflow-y-auto'>
                        {data?.data?.courseDetails?.lectures?.map((lecture, index) => (
                            <Card key={index} className={`hover:cursor-pointer mb-3 transition transform ${lecture._id === currentLecture?._id ? 'bg-gray-200 text-black' : 'dark:bg-gray-800'}`} onClick={() => handleSelectLecture(lecture)}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className='flex items-center'>
                                        {isLectureCompleted(lecture?._id) ?
                                            <CheckCircle2 size={24} className='text-green-500 mr-2' />
                                            :
                                            <CirclePlay size={24} className='text-gray-500 mr-2' />
                                        }
                                        <div>
                                            <CardTitle className="text-lg font-medium">{lecture.lectureTitle}</CardTitle>
                                        </div>
                                    </div>
                                    {isLectureCompleted(lecture?._id) && (
                                        <Badge variant={"outline"} className="bg-green-200 text-green-600">Completed</Badge>
                                    )
                                    }
                                </CardContent>
                            </Card>
                        ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress