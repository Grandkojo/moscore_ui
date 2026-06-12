import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import logo from "../assets/7.svg"

export default function Dashboard() {
  return (
    <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-sky-50 p-2 rounded-2xl">
            <img src={logo} alt="CreditPrint Logo" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <p className="text-textMuted text-xs font-medium mb-0.5">Welcome back,</p>
            <h1 className="text-lg font-bold tracking-tight leading-none text-slate-800">Kojo Mensah</h1>
          </div>
        </div>
        <Link to="/profile" className="w-10 h-10 shadow-sm rounded-full bg-white border border-slate-200 flex items-center justify-center active:scale-95 transition-transform">
          <UserIcon />
        </Link>
      </header>

      {/* Main Score Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl p-6 glass border border-primary/20"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-textMuted font-semibold mb-1">CreditPrint Score</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-bold tracking-tighter swift-gradient">742</span>
              <span className="text-textMuted font-medium">/ 850</span>
            </div>
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Strong</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-2 w-full bg-surfaceHover rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-primary"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-textMuted">Eligible up to</span>
            <span className="font-semibold text-text">GHS 1,000</span>
          </div>
        </div>
      </motion.div>

      {/* Signals Summary */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Score Signals</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SignalCard icon={<TrendingUp />} title="Inflow" value="Consistent" delay={0.1} />
          <SignalCard icon={<Zap />} title="Activity" value="High" delay={0.2} />
          <SignalCard icon={<ShieldCheck />} title="Repayment" value="Perfect" delay={0.3} />
        </div>
      </div>
    </div>
  )
}

function SignalCard({ icon, title, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-surface border border-border rounded-2xl p-4 space-y-3"
    >
      <div className="text-primary w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-textMuted text-xs font-medium mb-1">{title}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </motion.div>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-textMuted">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
