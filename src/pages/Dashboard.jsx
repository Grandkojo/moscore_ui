import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp, Zap, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { scoreService } from "../lib/score"

export default function Dashboard() {
  const [scoreData, setScoreData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    scoreService.getLatest()
      .then(data => setScoreData(data))
      .catch(err => console.error("No score found", err))
      .finally(() => setLoading(false))
  }, [])

  const getSignalLabel = (value) => {
    if (value >= 80) return "Excellent"
    if (value >= 60) return "Good"
    if (value >= 40) return "Fair"
    return "Needs Work"
  }

  return (
    <div className="px-6 py-6 space-y-8 max-w-4xl mx-auto w-full">
      {loading ? (
        <div className="py-20 flex justify-center text-slate-400">Loading your score...</div>
      ) : !scoreData ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm space-y-4"
        >
          <div className="mx-auto w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No Score Yet</h2>
          <p className="text-slate-500">Upload your MoMo statement to generate your first CreditPrint score.</p>
          <button 
            onClick={() => navigate('/score')}
            className="mt-4 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
          >
            Calculate Score
          </button>
        </motion.div>
      ) : (
        <>
          {/* Main Score Card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl p-6 glass border border-primary/20"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-textMuted font-semibold mb-1">Credit Score</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-6xl font-bold tracking-tighter swift-gradient">{scoreData.score}</span>
                  <span className="text-textMuted font-medium">/ 850</span>
                </div>
              </div>
              <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">{scoreData.band}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-2 w-full bg-surfaceHover rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(scoreData.score / 850) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-primary"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textMuted">Eligible up to</span>
                <span className="font-semibold text-text">GHS {scoreData.max_loan_ghs.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Signals Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Score Signals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SignalCard icon={<TrendingUp />} title="Inflow" value={getSignalLabel(scoreData.signals.inflow_consistency)} delay={0.1} />
              <SignalCard icon={<Zap />} title="Activity" value={getSignalLabel(scoreData.signals.transaction_diversity)} delay={0.2} />
              <SignalCard icon={<ShieldCheck />} title="Repayment" value={getSignalLabel(scoreData.signals.repayment_history)} delay={0.3} />
            </div>
          </div>
        </>
      )}
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
