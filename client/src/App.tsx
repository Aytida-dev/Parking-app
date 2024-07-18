import './App.css'
import { Button } from "@/components/ui/button"
import OrganisationLanding from './components/OrganisationLanding'
import InfrastructureLanding from './components/CreateTicket'
import { Toaster } from 'sonner'
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import CreateTicket from './components/CreateTicket'
import { Navbar } from './components/Navbar'
import StartTicket from './components/StartTicket'
import EndTicket from './components/EndTicket'

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <div>
        <Toaster richColors />
        <BrowserRouter>
          <LayoutWithNavbar>
            <Routes>
              <Route path='/' element={<OrganisationLanding />}></Route>
              {/* <Route path='/' element={<Navbar/>}></Route> */}
              <Route path='/createTicket' element={<CreateTicket />}></Route>
              <Route path='/startTicket' element={<StartTicket />}></Route>
              <Route path='/endTicket' element={<EndTicket />}></Route>
            </Routes>
          </LayoutWithNavbar>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  )
}

const LayoutWithNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {(location.pathname === '/createTicket' || location.pathname === '/startTicket' || location.pathname === '/endTicket') && <Navbar />} {/* Render Navbar only on /createTicket */}
      {children}
    </>
  );
};

export default App
