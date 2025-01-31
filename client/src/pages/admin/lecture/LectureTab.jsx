import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'



const MEDIA_API = "http://localhost:8080/api/v1/media"
const LectureTab = () => {

    const { courseId, lectureId } = useParams()
    const [title, setTitle] = useState("")
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0)
    const [btnDisable, setBtnDisable] = useState(true);

    const [editLecture, { data, isLoading, isSuccess, error }] = useEditLectureMutation()
    const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess, error: removeError }] = useRemoveLectureMutation();
    const { data: lectureData } = useGetLectureByIdQuery(lectureId)
    const fileChangeHandler = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true)
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    // this is function provide by axios so we can show our progress bar how media upload
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100)) / total);
                    }
                })
                if (res.data.success) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.log(error)
                toast.error("Failed to upload video");
            } finally {
                setMediaProgress(false);
            }
        }
    }
    const editLectureHandler = async () => {
        await editLecture({ lectureTitle: title, videoInfo: uploadVideoInfo, isPreviewFree: isFree, courseId, lectureId })
    }
    const removeLectureHandler = async () => {
        await removeLecture(lectureId);
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Your Lecture has been updated successfully")
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to update lecture")
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (removeSuccess) {
            toast.success(removeData?.message || "Your Lecture has been updated successfully")
        }
        if (error) {
            toast.error(removeError?.data?.message || "Failed to update lecture")
        }
    }, [removeSuccess, removeError]);

    useEffect(() => {
        if (lectureData?.lecture) {
            setTitle(lectureData?.lecture?.lectureTitle);
            setIsFree(lectureData?.lecture?.isPreviewFree);
            setUploadVideoInfo(lectureData?.lecture?.videoInfo);
        }
    }, [lectureData?.lecture])

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make Changes and click save when done.</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="destructive" onClick={removeLectureHandler} disabled={removeLoading}>
                        {removeLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait</> :
                            "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input type="text" placeholder="Ex. Introduction to javascript" onChange={(e) => setTitle(e.target.value)} value={title} />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input type="file" onChange={fileChangeHandler} accept="video/*" className="w-fit" placeholder="Ex. Introduction to javascript" />
                    {/* here we use this w-fit for input width automatically adjust */}
                </div>
                <div className='flex items-center space-x-2 my-5'>
                    <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
                    <Label>Is This Video Free</Label>
                </div>
                {mediaProgress &&
                    <div className='my-4'>
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress} % uploaded</p>
                    </div>}
                <div className='mt-4'>
                    <Button onClick={editLectureHandler} disabled={mediaProgress}>
                        {isLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait...</> :
                            "Update Lecture"
                        }
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}

export default LectureTab