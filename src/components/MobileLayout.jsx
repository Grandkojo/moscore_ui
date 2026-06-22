import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom"
import { Home, FileText, CreditCard, Target, User, ArrowLeft } from "lucide-react"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../assets/7.svg"

// ── Page config ────────────────────────────────────────────────────────────────
// Tab pages: show logo + greeting/title on the left, profile avatar on the right
// Sub-pages: show ← back + title on the left, no profile avatar
const TAB_PATHS = ["/dashboard", "/score", "/apply", "/repay"]

const PAGE_CONFIG = {
  "/dashboard":     { title: null,            isTab: true  },
  "/score":         { title: "Credit Score",  isTab: true  },
  "/apply":         { title: "Request Loan",  isTab: true  },
  "/repay":         { title: "Repay Loan",    isTab: true  },
  "/profile":       { title: "Profile",       isTab: false },
  "/score/details": { title: "Score Details", isTab: false },
}

function getPageConfig(pathname) {
  if (PAGE_CONFIG[pathname]) return PAGE_CONFIG[pathname]
  if (pathname.startsWith("/loans/")) return { title: "Loan Details", isTab: false }
  return { title: null, isTab: false }
}


export default function MobileLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { name: "Home",  path: "/dashboard", icon: Home },
    { name: "Score", path: "/score",     icon: Target },
    { name: "Apply", path: "/apply",     icon: FileText },
    { name: "Repay", path: "/repay",     icon: CreditCard },
  ]

  // Hide header + nav on auth and landing pages
  const isAuthPage = ["/", "/login", "/register"].includes(location.pathname)
  if (isAuthPage) {
    return (
      <div className="min-h-[100dvh] bg-background w-full relative overflow-hidden">
        <Outlet />
      </div>
    )
  }

  const config = getPageConfig(location.pathname)
  const isDashboard = location.pathname === "/dashboard"
  const userName = JSON.parse(localStorage.getItem("moscore_user") || "{}").name || "User"

  return (
    <div className="min-h-[100dvh] bg-background w-full relative flex flex-col">

      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
        <div className="flex justify-between items-center px-5 py-3 max-w-4xl mx-auto w-full">

          {config.isTab ? (
            /* Tab page — logo + greeting or tab title */
            <>
              <div className="flex items-center gap-3">
                <div className="bg-sky-50 p-1.5 rounded-xl flex-shrink-0">
                  <img src={logo} alt="MoScore" className="h-7 w-7 object-contain" />
                </div>
                <div>
                  {isDashboard ? (
                    <>
                      <p className="text-slate-400 text-xs font-medium leading-none mb-0.5">Welcome back,</p>
                      <p className="text-slate-800 font-bold text-base leading-none">{userName}</p>
                    </>
                  ) : (
                    <p className="text-slate-800 font-bold text-base leading-none">{config.title}</p>
                  )}
                </div>
              </div>
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center active:scale-95 transition-transform"
              >
                <User className="w-4 h-4 text-slate-500" />
              </Link>
            </>
          ) : (
            /* Sub-page — back button + title on one line, no avatar */
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
              </button>
              <p className="text-slate-800 font-bold text-base leading-none">{config.title}</p>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-28 scroll-smooth">
        <Outlet />
      </main>

      {/* ── Bottom Navigation ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white/70 backdrop-blur-xl border-t-2 border-slate-200/80 pt-3 pb-3">
        <nav className="flex justify-between items-center max-w-[450px] mx-auto px-4 w-full">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path)
            const Icon = tab.icon

            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={cn(
                  "relative flex items-center justify-center px-4 py-2.5 rounded-full transition-all duration-300 ease-out",
                  isActive
                    ? "text-white bg-primary shadow-md shadow-primary/20"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-all duration-300", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="ml-2 text-sm font-bold tracking-wide overflow-hidden whitespace-nowrap"
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
