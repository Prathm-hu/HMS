import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishedCourseMutation } from '@/features/api/courseApi'
import { toast } from 'sonner'
const CourseTab = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [editCourse, { data, isLoading, isError, isSuccess, error }] = useEditCourseMutation();
    const { data: courseData, isLoading: courseLoading, error: courseError, isError: courseIsError, isSuccess: courseIsSuccess, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });
    // 1.when we fetch api with rtk query and when data get with id then pass like this 2.when we want to fetch any prop or data change then call our this get api then we can use this refetchonmountchangearg method and call automatically
    const [publishedCourse, { }] = usePublishedCourseMutation()
    useEffect(() => {
        if (courseData?.course) {
            const course = courseData?.course
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
    }, [courseData])

    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    })
    const [preview, setPreview] = useState()
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const selectCourseLevel = (courseLevel) => {
        setInput({ ...input, courseLevel })
    }
    const selectCategory = (category) => {
        setInput({ ...input, category })
    }

    // get file
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setInput({ ...input, courseThumbnail: file })
            const fileReader = new FileReader()
            fileReader.onloadend = () => setPreview(fileReader.result);
            fileReader.readAsDataURL(file);
            // this use because when we read our file then use this file reader and we can preview our file
        }
    }

    const updateCourseHandler = async () => {
        // when we use any file input then always use formdata
        const formData = new FormData();
        formData.append('courseTitle', input.courseTitle);
        formData.append('subTitle', input.subTitle);
        formData.append('description', input.description);
        formData.append('category', input.category);
        formData.append('courseLevel', input.courseLevel);
        formData.append('coursePrice', input.coursePrice);
        formData.append('courseThumbnail', input.courseThumbnail);
        await editCourse({ formData, courseId });
    }

    const publishStatusHandler = async (action) => {
        try {
            const responce = await publishedCourse({ courseId, query: action })
            if (responce.data) {
                refetch() // this will call our get course by id query again with new course id to get updated data
                toast.success(responce.data.message);
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course")
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Your Course has been Update successfully")
        }
        if (error) {
            toast.error(error.message || "Failed to update course");
        }
    }, [isSuccess, error]);

    if (courseLoading) return <Loader2 className='h-4 w-4 animate-spin' />
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>Make Changes to your courses here. Click save when you're done.</CardDescription>
                </div>
                <div className='space-x-3'>
                    <Button disabled={courseData?.course?.lectures?.length === 0} variant="outline" onClick={() => publishStatusHandler(courseData?.course?.isPublished ? "false" : "true")}>
                        {courseData?.course?.isPublished ? "Unpublished" : "Published"}
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Course Title</Label>
                        <Input type="text" placeholder="Ex. Fullstack Developer" name="courseTitle" value={input.courseTitle} onChange={changeEventHandler} />
                    </div>
                </div>
                <div className='mt-5'>
                    <div>
                        <Label>Subtitle</Label>
                        <Input type="text" placeholder="Ex. Become Developer o to hero" name="subTitle" value={input.subTitle} onChange={changeEventHandler} />
                    </div>
                </div>
                <div className='mt-5'>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} value={input.description} />
                    </div>
                </div>
                <div className='mt-5 flex items-center gap-5'>
                    <div>
                        <Label>Category</Label>
                        <Select onValueChange={selectCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Next JS">Next JS</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                    <SelectItem value="Frontend Development">
                                        Frontend Development
                                    </SelectItem>
                                    <SelectItem value="Fullstack Development">
                                        Fullstack Development
                                    </SelectItem>
                                    <SelectItem value="MERN Stack Development">
                                        MERN Stack Development
                                    </SelectItem>
                                    <SelectItem value="Javascript">Javascript</SelectItem>
                                    <SelectItem value="Python">Python</SelectItem>
                                    <SelectItem value="Docker">Docker</SelectItem>
                                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                                    <SelectItem value="HTML">HTML</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Course Level</Label>
                        <Select onValueChange={selectCourseLevel}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Course Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Course Level</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Price in (INR)</Label>
                        {/* here we use w-fit because they adjust auto width how that need */}
                        <Input type="number" name="coursePrice" value={input.coursePrice} onChange={changeEventHandler} placeholder="199" className="w-fit" />
                    </div>
                </div>
                <div className='mt-5'>
                    <Label>Course Thumnail</Label>
                    <Input type="file" className="w-fit" accept="image/*" onChange={selectThumbnail} />
                    {preview && (
                        <img src={preview} alt="Course Thumbnail" className='w-64 my-2' />
                    )

                    }
                </div>
                <div className='mt-5 flex gap-4'>
                    <Button variant="outline" onClick={() => navigate("/admin/course")}>Cancel</Button>
                    <Button disabled={isLoading} onClick={updateCourseHandler}>
                        {isLoading ?
                            <>
                                <Loader2 className='animate-spin mr-2 h-4 w-4' />
                                Please wait...
                            </>
                            : "Save"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card >
    )
}

export default CourseTab