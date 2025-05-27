import './App.css';
import Login from './pages/login';
import HerroSection from './pages/students/HerroSection.jsx';
import MainLayout from './layout/MainLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Mylearning from './pages/students/Mylearning.jsx'
import SearchPage from './pages/students/SearchPage.jsx'
import Profile from './pages/students/Profile.jsx'
import Courses from "./pages/students/courses.jsx"
import Sidebar from "./pages/admin/Sidebar.jsx"
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/course/CourseTable.jsx'
import AddCourse from './pages/admin/course/AddCourse.jsx'
import CourseDetail from './pages/students/CourseDetail'
import CreateLecture from './pages/admin/lecture/createLecture.jsx'
import EditLecture from './pages/admin/lecture/EditLecture.jsx'
import EditCourse from './pages/admin/course/EditCourse.jsx'
import CourseProgress from './pages/students/courseProgress.jsx'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes';
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';



const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <HerroSection />
            <Courses/>
          </>
        ),
      },
      {
        path: 'login',
        element:<AuthenticatedUser>
            <Login />
        </AuthenticatedUser> ,
      },
      {
        path: 'my-learning',
        element: <ProtectedRoute>
          <Mylearning />
        </ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute>
          <Profile />
        </ProtectedRoute>,
      },
      {
        path:'course-detail/:courseId',
        element:<ProtectedRoute>
          <CourseDetail/>
        </ProtectedRoute>
      },
      {
        path:'course-progress/:courseId',
        element:<ProtectedRoute>
          <PurchaseCourseProtectedRoute>
            <CourseProgress />
          </PurchaseCourseProtectedRoute>
        </ProtectedRoute>
      },
      {
        path:'course/search',
        element:<ProtectedRoute>
          <SearchPage/>
        </ProtectedRoute>
      },
      {
        path:"admin",
        element:<AdminRoute>
          <Sidebar />
        </AdminRoute>,
        children:[
          {
            path:"dashboard",
            element:<Dashboard/>
          },
          {
            path:"course",
            element:<CourseTable/>
          },
          {
            path:"course/create",
            element:<AddCourse/>
          },
          {
            path:"course/:courseId",
            element:<EditCourse/>
          },
          {
            path:"course/:courseId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"course/:courseId/lecture/:lectureId",
            element:<EditLecture/>
          },
        ]
      }
    ],
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
