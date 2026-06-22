import { motion } from "framer-motion"
import { Target, CheckCircle } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

export default function ScoreDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const score = location.state?.score

  if (!score) {
    return (
      <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-slate-500">No score details found.</p>
        <button onClick={() => navigate('/score')} className="text-primary font-bold px-4 py-2 bg-sky-50 rounded-lg">Go back</button>
      </div>
    )
  }

  return (
    <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">

      {/* Main Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-8"
      >
        <div className="flex items-end space-x-3">
           <span className="text-6xl font-black tracking-tighter swift-gradient">{score.score}</span>
           <span className="text-lg font-bold text-slate-400 mb-1">/ 850 ({score.band})</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl">
             <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Max Loan</p>
             <p className="text-2xl font-bold text-slate-800">GHS {score.max_loan_ghs}</p>
          </div>
          <div className="p-5 bg-purple-50/50 border border-purple-100 rounded-2xl">
             <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Interest Rate</p>
             <p className="text-2xl font-bold text-slate-800">{score.interest_rate_pct}%</p>
          </div>
        </div>
      </motion.div>

      {/* Strengths and Weaknesses */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {score.top_strengths?.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-600 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Strengths
            </h3>
            <ul className="space-y-3">
              {score.top_strengths.map((s, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-slate-700 bg-emerald-50/30 p-4 rounded-xl">
                  <span className="leading-relaxed font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {score.top_weaknesses?.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-wide uppercase text-rose-600 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Areas to Improve
            </h3>
            <ul className="space-y-3">
              {score.top_weaknesses.map((s, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-slate-700 bg-rose-50/30 p-4 rounded-xl">
                  <span className="leading-relaxed font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  )
}
