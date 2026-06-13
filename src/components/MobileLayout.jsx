import { Outlet, NavLink, useLocation } from "react-router-dom"
import { Home, FileText, Activity, User, CreditCard, Target } from "lucide-react"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function MobileLayout() {
  const location = useLocation()

  const tabs = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Score", path: "/score", icon: Target },
    { name: "Apply", path: "/apply", icon: FileText },
    { name: "Repay", path: "/repay", icon: CreditCard },
  ]

  // Hide nav on auth pages
  if (location.pathname === "/register" || location.pathname === "/login" || location.pathname === "/") {
    return (
      <div className="min-h-[100dvh] bg-background w-full relative overflow-hidden">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background w-full relative flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 scroll-smooth">
        <Outlet />
      </main>

      {/* Bottom Navigation - Floating Pill */}
      <div className="fixed bottom-6 md:bottom-8 left-0 right-0 z-50 flex justify-center px-6 w-full pointer-events-none">
        <nav className="flex justify-between items-center bg-white/90 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-2 py-2 w-full max-w-[450px] pointer-events-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path)
            const Icon = tab.icon

            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={cn(
                  "relative flex items-center justify-center px-4 py-2.5 rounded-full transition-all duration-200 ease-out",
                  isActive ? "text-white bg-primary shadow-md shadow-primary/20" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-all duration-200", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                <AnimatePresence>
                  {isActive && (
                    <motion.span 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="ml-2 text-xs font-bold tracking-wide overflow-hidden whitespace-nowrap"
                    >
                      {tab.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
