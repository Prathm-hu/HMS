import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import { AdminRoute, AuhtenticatedUser, ProtectedRoute } from './components/ProtectedRoute'
import PurchasedCourseRoute from './components/PurchasedCourseRoute'
import MainLayout from './layout/MainLayout'
import AddCourse from './pages/admin/course/AddCourse'
import CourseTable from './pages/admin/course/CourseTable'
import EditCourse from './pages/admin/course/EditCourse'
import Dashboard from './pages/admin/Dashboard'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import Sidebar from './pages/admin/Sidebar'
import Login from './pages/Login'
import CourseDetails from './pages/student/CourseDetails'
import CourseProgress from './pages/student/courseProgress'
import Courses from './pages/student/Courses'
import HeroSection from './pages/student/HeroSection'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import SearchPage from './pages/student/SearchPage'
import { ThemeProvider } from './components/ThemeProvider'


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element:
          <>
            <HeroSection />
            <Courses />
          </>
      },
      {
        path: "/login",
        element: <AuhtenticatedUser><Login /></AuhtenticatedUser>
      },
      {
        path: "my-learning",
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "course-detail/:courseId",
        element: <ProtectedRoute><CourseDetails /></ProtectedRoute>
      },
      {
        path: "course-progress/:courseId",
        element:
          <ProtectedRoute>
            <PurchasedCourseRoute>
              <CourseProgress />
            </PurchasedCourseRoute>
          </ProtectedRoute>
      },
      {
        path: "course/search",
        element: <ProtectedRoute> <SearchPage /></ProtectedRoute>
      },
      // adming routes start from here
      {
        path: "admin",
        element: <AdminRoute> <Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId",
            element: <EditCourse />,
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ]
      }
    ]
  }
])

function App() {

  return (
    <div>
      <ThemeProvider>
        <RouterProvider router={appRouter}></RouterProvider>
      </ThemeProvider>

    </div>
  )
}

export default App
