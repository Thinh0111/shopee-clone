import { useContext, useEffect } from 'react'
import { AppContext } from './context/app.context'
import useRouteElement from './useRouteElement'
import { LocalStorageEventTarget } from './utils/auth'

/**
 * Khi url thay đổi thì các component nào dùng các hook như
 * useRoutes, useParmas, useSearchParams,...
 * sẽ bị re-render.
 * Ví dụ component `App` dưới đây bị re-render khi mà url thay đổi
 * vì dùng `useRouteElements` (đây là customhook của `useRoutes`)
 */

function App() {
  // như component này mình có dùng hook useRouteElement() mà useRouteElement() này chính là 1 custom hook của useRoutes() nên là khi url thay đổi thì App component nó bị re render

  const routeElements = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLocalStorage', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLocalStorage', reset)
    }
  }, [reset])

  return <div>{routeElements}</div>
}

export default App
