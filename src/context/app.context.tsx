import React, { createContext, ReactNode, useState } from 'react'
import { getAccessTokenFromLocalStorage } from 'src/utils/auth'

// dùng context api để quản lý những cái state, bởi vì dùng context api có thể chia sẻ với component nằm sau bên trong app hơn
interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const initialAppContext: AppContextInterface = {
  // AppContext này sẽ chạy trước bởi vì nó bao ngoài App component thằng này nó chạy trước thì nó chạy đoạn isAuthenticated: Boolean(getAccessTokenFromLocalStorage()) lấy từ localStorage nó ko có nên isAuthenticated: false
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null
}

// initialAppContext là giá trị khởi tạo khi ta sử dụng createContext ta bắt buộc truyền giá trị khởi tạo. Khi nào giá trị này được sử dụng khi mà chúng ta ko truyền vào Provider cái value thì giá trị này được sử dụng
export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AppContext.Provider>
}
