import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi'
import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

const PurchasedCourseRoute = ({ children }) => {
    const { courseId } = useParams()
    const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId)
    if (isLoading) {
        return <h1>Loading...</h1>
    }
    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`} />
}

export default PurchasedCourseRoute