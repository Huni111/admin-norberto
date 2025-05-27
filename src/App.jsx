import { useState, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root'
import PaginaStart from '../pages/index'
import Setari from '../pages/Setari'
import Comenzi from '../pages/Comenzi'
import Produse from '../pages/Produse'
import Clienti from '../pages/Clinenti'

function App() {


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/', element:
            <Suspense fallback={<div>Loading...</div>}>
             < PaginaStart />
            </Suspense>
        },
        {
          path: '/produse', element:
            <Suspense fallback={<div>Loading...</div>}>
              < Produse />
            </Suspense>
        },
        {
          path: '/comenzi', element:
            <Suspense fallback={<div>Loading...</div>}>
              < Comenzi />
            </Suspense>
        },
        {
          path: '/clienti', element:
            <Suspense fallback={<div>Loading...</div>}>
              < Clienti />
            </Suspense>
        },
        {
          path: '/setari', element:
            <Suspense fallback={<div>Loading...</div>}>
             < Setari />
            </Suspense>
        },


      ]
    }
  ])




  return (
    <>
      <RouterProvider router={router}>
        {router}
      </RouterProvider>


    </>
  )
}

export default App
