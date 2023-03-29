import { BrowserRouter, Route, Routes } from "react-router-dom"
import Protected from "../components/protected/Protected"
import Login from "../pages/Login"
import HomeAdmin from "../pages/HomeAdmin"
import HomeUser from "../pages/HomeUser"

export const Router: React.FC = () => {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Protected modulo="home" page={<HomeUser />} />} />
        <Route path="/admin" element={<Protected modulo="admin" page={<HomeAdmin />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Protected modulo="home" page={<HomeUser />} />} />
      </Routes>
    </BrowserRouter>
  )
}