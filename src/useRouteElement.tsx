import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from './constants/path'
import { AppContext } from './context/app.context'
import CartLayout from './layouts/CartLayout'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
// import Cart from './pages/Cart'
// import Login from './pages/Login'
// import NotFound from './pages/NotFound'
// import ProductDetail from './pages/ProductDetail'
// import ProductList from './pages/ProductList'
// import Register from './pages/Register'
import UserLayout from './pages/User/layouts/UserLayout'
// import ChangePassword from './pages/User/page/ChangePassword'
// import HistoryPurchase from './pages/User/page/HistoryPurchase'
// import Profile from './pages/User/page/Profile'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/page/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/page/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/page/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))

//* note
/**
 * Để tối ưu re-render thì nên ưu tiên dùng <Outlet /> thay cho {children}
 * Lưu ý là <Outlet /> nên đặt ngay trong component `element` thì mới có tác dụng tối ưu
 * Chứ không phải đặt bên trong children của component `element`
 */

//  ✅ Tối ưu re-render
// export default memo(function RegisterLayout({ children }: Props) {
//  return (
//    <div>
//      <RegisterHeader />
//      {children}
//      <Outlet />
//      <Footer />
//    </div>
//  )
//  })

//  ❌ Không tối ưu được vì <Outlet /> đặt vào vị trí children
// Khi <Outlet /> thay đổi tức là children thay đổi
// Dẫn đến component `RegisterLayout` bị re-render dù cho có dùng React.memo như trên
// <RegisterLayout>
//   <Outlet />
// </RegisterLayout>

// isAuthenticated = true là người dùng login còn false là người dùng chưa login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  // khi url thay đổi tức là <Outlet/> này nó thay đổi dẫn đến RejectedRoute thay đổi dẫn đến children của RegisterLayout thay đổi. Khi mà children props thay đổi thì dẫn đến re render.
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

//* useRouteElement
const useRouteElement = () => {
  // Mặc định các trong react-router-dom nó sẽ chạy theo thứ tự khi mình khai báo
  // Để react-router-dom nhận điện được ai là chính thì xét thêm 1 thuộc tính index: true là được (để đâu cũng được khỏi cần phải lo chạy theo thứ tự nữa)
  // const routeElement = useRoutes([
  //   {
  //     path: '',
  //     element: <ProtectedRoute />,
  //     children: [
  //       {
  //         path: path.cart,
  //         element: (
  //           <CartLayout>
  //             <Cart />
  //           </CartLayout>
  //         )
  //       },
  //       {
  //         path: path.user,
  //         element: (
  //           <MainLayout>
  //             <UserLayout />
  //           </MainLayout>
  //         ),
  //         children: [
  //           // Khi mà nói vào path /user/profile nó sẽ đi qua path /user nó nhảy vào khu vực <MainLayout><UserLayout></MainLayout> trong UserLayout có dùng Outlet nên là đưa Profile hay ChangePassword vào thay thế khu vực Outlet trong UserLayout
  //           {
  //             path: path.profile,
  //             element: <Profile />
  //           },
  //           {
  //             path: path.changePassword,
  //             element: <ChangePassword />
  //           },
  //           {
  //             path: path.historyPurchase,
  //             element: <HistoryPurchase />
  //           }
  //         ]
  //       }
  //     ]
  //   },

  //   // Khi người dùng login rồi thì ko cho người dùng vào trang login vs register nữa
  //   {
  //     path: '',
  //     element: <RejectedRoute />,
  //     children: [
  //       {
  //         path: path.login,
  //         element: (
  //           <RegisterLayout>
  //             {' '}
  //             <Login />
  //           </RegisterLayout>
  //         )
  //       },
  //       {
  //         path: path.register,
  //         element: (
  //           <RegisterLayout>
  //             {' '}
  //             <Register />
  //           </RegisterLayout>
  //         )
  //       }
  //     ]
  //   },
  //   {
  //     path: '/',
  //     index: true,
  //     element: (
  //       <MainLayout>
  //         <ProductList />
  //       </MainLayout>
  //     )
  //   },
  //   {
  //     path: path.productDetail,
  //     element: (
  //       <MainLayout>
  //         <ProductDetail />
  //       </MainLayout>
  //     )
  //   },
  //   {
  //     path: '*',
  //     element: (
  //       <MainLayout>
  //         <NotFound />
  //       </MainLayout>
  //     )
  //   }
  // ])

  //* React.lazy (Toi uu route using memo())
  const routeElement = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        // Khi làm như này vẫn đảm bảo đc RegisterLayout có Outlet nên khi url thay đổi Outlet này thay đổi nên ko ảnh hưởng với RegisterLayout nữa. (ko làm bị re render nữa)
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchase,
                  element: (
                    <Suspense>
                      <HistoryPurchase />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },

    //* Toi uu route using memo()
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '',
          index: true,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    }

    //* Chuyển từ trang ProductList sang ProductDetail lăp đi lăp lại <MainLayout> nên chỗ này ảnh hưởng đến việc re render MainLayout (chỗ này đáng lẽ ko nên re render bởi vì dùng chung 1 <MainLayout/>, <MainLayout/> không thay đổi chỉ thay đổi nội dung children thôi mà chúng ta render cả <MainLayout/> lại thì ko tối ưu)
    // {
    //   path: path.productDetail,
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <ProductDetail />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // },
    // {
    //   path: '',
    //   index: true,
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <ProductList />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // },
    // {
    //   path: '*',
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <NotFound />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // }
  ])
  return routeElement
}

export default useRouteElement
