import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

    const [SearchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate()
    const searchHandler = (e) => {
        e.preventDefault();
        if (SearchQuery.trim() !== "") {
            navigate(`/course/search?query=${SearchQuery}`)
        }
        setSearchQuery("")
    }
    return (
        // here we user dark: like this because when in dark mode then automatically get after colom color
        <div className='relative bg-gradient-to-l from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center'>
            <div className='max-w-3xl mx-auto'>
                <h1 className='text-white text-4xl font-bold mb-4'>Find Best Courses For You</h1>
                <p className='text-gray-200 dark:text-gray-400 mb-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum quaerat maiores ex, sit ducimus quos!</p>
                <form onSubmit={searchHandler} className='mb-8 flex justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto'>
                    <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={SearchQuery}
                        placeholder='Search Best Courses For You...'
                        className='outline-none flex-grow border-none rounded-l-full focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'
                    />
                    <Button type="submit" className="bg-blue-500 dark:bg-gray-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover::bg-blue-800 h-12">Search</Button>
                </form>
                <Button onClick={() => navigate(`/course/search?query`)} className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-300">Explore Courses</Button>
            </div>
        </div>
    )
}

export default HeroSection