import { motion } from "framer-motion"
import { LogOut, ChevronRight, Settings, Shield, Bell, HelpCircle, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiCall } from "../lib/api"

export default function Profile() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await apiCall("/auth/logout", { method: "POST" })
    } catch (e) {
      console.error("Logout failed:", e)
    }
    localStorage.removeItem("moscore_token")
    localStorage.removeItem("moscore_user")
    navigate("/login")
  }

  return (
    <div className="px-6 py-8 space-y-8 max-w-3xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Profile</h1>
      </header>

      {/* User Info */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-primary font-bold text-xl uppercase">
          {JSON.parse(localStorage.getItem("moscore_user") || "{}").name?.substring(0, 2) || "U"}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {JSON.parse(localStorage.getItem("moscore_user") || "{}").name || "User"}
          </h2>
          <p className="text-slate-500 text-sm">Active</p>
        </div>
      </motion.div>

      {/* Settings List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <SettingsItem icon={<Settings className="w-5 h-5" />} title="Account Settings" />
        <SettingsItem icon={<Shield className="w-5 h-5" />} title="Security & Privacy" />
        <SettingsItem icon={<Bell className="w-5 h-5" />} title="Notifications" />
        <SettingsItem icon={<HelpCircle className="w-5 h-5" />} title="Help & Support" isLast />
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-4"
      >
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded-xl font-semibold transition-colors active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </motion.div>
    </div>
  )
}

function SettingsItem({ icon, title, isLast }) {
  return (
    <div className={`flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors active:bg-slate-100 cursor-pointer ${!isLast ? 'border-b border-slate-100' : ''}`}>
      <div className="flex items-center space-x-3 text-slate-700">
        <div className="text-slate-400">
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300" />
    </div>
  )
}
