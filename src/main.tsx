import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from './context/app.context'
import ErrorBoundary from './components/ErrorBoundary'
import 'src/i18n/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,

      // `retry` được sử dụng để thực hiện lại một query bị lỗi hoặc thất bại. Ở đây khi bị lỗi ko cho gọi lại
      retry: 0
    }
  }
})

// Bao bọc ErrorErrorBoundary cái cái App thì cả cái app mình đc bảo vệ bởi ErrorBoundary nếu có lỗi trong cả app thì ErrorErrorBoundary nó có thể render về cho chúng ta một UI dự phòng
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
