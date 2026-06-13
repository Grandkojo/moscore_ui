import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import MobileLayout from "./components/MobileLayout"
import Landing from "./pages/Landing"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Score from "./pages/Score"
import Apply from "./pages/Apply"
import Repay from "./pages/Repay"
import Profile from "./pages/Profile"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/score" element={<Score />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/repay" element={<Repay />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
