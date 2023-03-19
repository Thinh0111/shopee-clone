import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface Props {
  children?: React.ReactNode
}

const MainLayoutInner = ({ children }: Props) => {
  // vẫn giữ children để trong những trường hợp nào mình ko dùng được thằng Outlet thì mình sử dụng children
  return (
    <div>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </div>
  )
}
const MainLayout = memo(MainLayoutInner)
export default MainLayout
