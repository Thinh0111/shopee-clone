import React, { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import { AppContext } from './context/app.context'
import CartLayout from './layouts/CartLayout'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import Cart from './pages/Cart'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import ProductList from './pages/ProductList'
import Register from './pages/Register'
import UserLayout from './pages/User/layouts/UserLayout'
import ChangePassword from './pages/User/page/ChangePassword'
import HistoryPurchase from './pages/User/page/HistoryPurchase'
import Profile from './pages/User/page/Profile/Profile'

// isAuthenticated = true là người dùng login còn false là người dùng chưa login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElement = () => {
  // Mặc định các trong react-router-dom nó sẽ chạy theo thứ tự khi mình khai báo
  // Để react-router-dom nhận điện được ai là chính thì xét thêm 1 thuộc tính index: true là được (để đâu cũng được khỏi cần phải lo chạy theo thứ tự nữa)
  const routeElement = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.card,
          element: (
            <CartLayout>
              <Cart />
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            // Khi mà nói vào path /user/profile nó sẽ đi qua path /user nó nhảy vào khu vực <MainLayout><UserLayout></MainLayout> trong UserLayout có dùng Outlet nên là đưa Profile hay ChangePassword vào thay thế khu vực Outlet trong UserLayout
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },

    // Khi người dùng login rồi thì ko cho người dùng vào trang login vs register nữa
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              {' '}
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              {' '}
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    }
  ])
  return routeElement
}

export default useRouteElement
