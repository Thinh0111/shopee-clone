import React from 'react'
import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Register from './pages/Register'

const useRouteElement = () => {
  const routeElement = useRoutes([
    {
      path: '/',
      element: <ProductList />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    }
  ])
  return routeElement
}

export default useRouteElement
