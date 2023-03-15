import React from 'react'
import { Outlet } from 'react-router-dom'
import UserSideNav from '../../components/UserSideNav'

const UserLayout = () => {
  return (
    <div>
      <UserSideNav />
      <Outlet />
    </div>
  )
}

export default UserLayout
