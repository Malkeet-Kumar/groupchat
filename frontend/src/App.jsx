import { useEffect, useState } from 'react'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'
import Home from './pages/home'
import LoginPage from './pages/loginSignup'
import { SocketState } from './states/socketState'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<LoginPage/>
  }
])

function App(){
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
