import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const BuyCoursePriceButton = ({ courseId }) => {
    const [createCheckoutSession, { data, isLoading, isSuccess, isError, error }] = useCreateCheckoutSessionMutation()
    const purchaseCourseHandler = async () => {
        await createCheckoutSession(courseId);
        // Navigate to the checkout page
        // window.location.href = data.createCheckoutSession.url
    }
    useEffect(() => {
        if (isSuccess) {
            if (data?.url) {
                window.location.href = data.url;//redirect to stripe checkout url
            } else {
                toast.error("Failed to create checkout session")
                // window.location.href = "/";//redirect to home page if there is no checkout url
            }
        }
        if (isError) {
            toast.error(error?.data?.message || "Failed to create checkout session")
        }
    }, [data, isSuccess, isError, error])
    return (
        <div>
            <Button disabled={isLoading} className="w-full" onClick={purchaseCourseHandler}>
                {isLoading ?
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please Wait...
                    </>

                    :
                    "Purchase Course"
                }
            </Button>
        </div>
    )
}

export default BuyCoursePriceButton