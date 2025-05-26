import { useState, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root'

function App() {


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/', element:
            <Suspense fallback={<div>Loading...</div>}>
              <div>Tablou de bord</div>
            </Suspense>
        },
        {
          path: '/produse', element:
            <Suspense fallback={<div>Loading...</div>}>
              <div>Produse</div>
            </Suspense>
        },
        {
          path: '/comenzi', element:
            <Suspense fallback={<div>Loading...</div>}>
              <div>Comenzi</div>
            </Suspense>
        },
        {
          path: '/clienti', element:
            <Suspense fallback={<div>Loading...</div>}>
              <div>Clienți (Companii)</div>
            </Suspense>
        },
        {
          path: '/setari', element:
            <Suspense fallback={<div>Loading...</div>}>
              <div>Setări</div>
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
