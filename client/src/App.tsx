import './App.css'
import { Button } from "@/components/ui/button"
import OrganisationLanding from './components/OrganisationLanding'
import InfrastructureLanding from './components/InfrastructureLanding'
import { Toaster } from 'sonner'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
      <div>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<OrganisationLanding />}></Route>
            <Route path='/InfrastructureLanding' element={<InfrastructureLanding />}></Route>
            {/* <InfrastructureLanding></InfrastructureLanding> */}
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  )
}

export default App
