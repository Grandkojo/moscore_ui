import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import MobileLayout from "./components/MobileLayout"
import Register from "./pages/Register"
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
          <Route path="/" element={<Navigate to="/register" replace />} />
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
