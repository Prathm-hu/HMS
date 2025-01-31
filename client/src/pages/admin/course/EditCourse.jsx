import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CourseTab from './CourseTab'

const EditCourse = () => {
    const navigate = useNavigate()
    const { courseId } = useParams()
    return (
        <div className='flex-1'>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='font-bold text-xl'>Add Details Information regarding course</h1>
                <Link to={`/admin/course/${courseId}/lecture`}>
                    <Button variant="link" className="hover:text-blue-600">Go to lectures Page</Button>
                </Link>
            </div>
            <CourseTab />
        </div>
    )
}

export default EditCourse