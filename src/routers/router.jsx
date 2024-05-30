import {
    createBrowserRouter,
    // RouterProvider,
  } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
//import About from "../components/About";
//import Blog from "../components/Blog";
import SingleBook from "../shop/SingleBook";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadBook from "../dashboard/UploadBook";
import ManageBooks from "../dashboard/ManageBooks";
import EditBooks from "../dashboard/EditBooks";
import Signup from "../components/Signup";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Logout from "../components/Logout";  
import BookCategories from "../components/BookCategories";
import Wishlist from "../components/Wishlist";
import Cart from "../components/Cart";
//import UserProfile from "../components/UserProfile";
import UploadedBooks from "../components/UploadedBooks";
import SearchedBooks from "../components/SearchedBooks";
import Orders from "../components/Orders";
import UserEditBook from "../components/UserEditBook";
import UserUploadBook from "../components/UserUploadBook";
import Users from "../dashboard/Users";
import AllOrders from "../dashboard/AllOrders";
import About from "../components/About";
import Contact from "../components/Contact";
import Payment from "../components/Payment";

const token = localStorage.getItem('access-token');

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path:'/',
          element:<Home/>
        },
        {
          path: '/shop',
          element:<PrivateRoute><Shop/></PrivateRoute>
        },
        {
          path:"/bookcategories",
          element:<PrivateRoute><BookCategories/></PrivateRoute>
        },
        {
          path:"/about",
          element:<About/>
        },
        {
          path:"/contact",
          element:<Contact/>
        },
        {
          path:"/book/:id",
          element:<SingleBook/>,
          loader: ({params}) => fetch(`https://book-store-api-theta.vercel.app/book/${params.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json", // Set content type header explicitly
              authorization: `Bearer ${token}`,
            },
          })
        },
        {
          path : "/wishlist",
          element : <Wishlist/>
        },
        {
          path : "/cart",
          element : <Cart/>
        },
        {
          path : "/process-checkout",
          element : <Payment/>
        },
        {
          path: "/uploaded-books",
          element : <UploadedBooks/>
        },
        {
          path: "/books/searchedbooks",
          element : <SearchedBooks/>
        },
        {
          path: "/orders",
          element : <Orders/>
        },
        {
          path: "/user/upload-book",
          element : <UserUploadBook/>
        },
        {
          path: "/user/edit-book/:id",
          element : <UserEditBook/>,
          loader: ({params}) => fetch(`https://book-store-api-theta.vercel.app/book/${params.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json", // Set content type header explicitly
              authorization: `Bearer ${token}`,
            },
          })
        },
      ]
    },
    {
      path:"/admin/dashboard",
      element:<DashboardLayout/>,
      children: [
        {
          path:"/admin/dashboard-page",
          element: <Dashboard/>
        },
        {
          path:"/admin/all-users",
          element: <Users/>
        },
        {
          path:"/admin/all-orders",
          element: <AllOrders/>
        },
        {
          path: "/admin/upload",
          element: <UploadBook/>
        },
        {
          path: "/admin/manage",
          element: <ManageBooks/>
        },
        {
          path:"/admin/edit-books/:id",
          element: <EditBooks/>,
          loader: ({params}) => fetch(`https://book-store-api-theta.vercel.app/book/${params.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json", // Set content type header explicitly
              authorization: `Bearer ${token}`,
            },
          })
        }
      ]
    },
    {
      path: "sign-up",
      element:<Signup/>
    },
    {
      path:"login",
      element: <Login/>
    },
    {
      path:"logout",
      element:<PrivateRoute><Logout/></PrivateRoute>
    },

  ]);

  export default router;     