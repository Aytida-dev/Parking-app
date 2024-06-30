import './App.css'
import { Button } from "@/components/ui/button"
import OrganisationLanding from './components/OrganisationLanding'
import InfrastructureLanding from './components/InfrastructureLanding'
import { Toaster } from 'sonner'
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<OrganisationLanding />}></Route>
            <Route path='/InfrastructureLanding' element={<InfrastructureLanding />}></Route>
            {/* <InfrastructureLanding></InfrastructureLanding> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
