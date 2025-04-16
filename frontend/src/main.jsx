import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HeroUIProvider} from '@heroui/react'
import './index.css'
import LoadingScreen from "./components/LoadingScreen";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLogin/>,
  },
  {
    path: '/admin',
    element: <AdminPanel/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <main className="dark">
          <RouterProvider router={router} />
      </main>
    </HeroUIProvider>
  </StrictMode>,
)
