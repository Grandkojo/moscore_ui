import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, AlertCircle, TrendingUp, CheckCircle2, Loader2, ChevronRight, Lightbulb } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiCall } from "../lib/api"
import { useNotification } from "../contexts/NotificationContext"

const TENURE_OPTIONS = [7, 14, 30, 60]

export default function Apply() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const [eligibility, setEligibility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [selectedAmount, setSelectedAmount] = useState(null)
  const [tenure, setTenure] = useState(30)

  useEffect(() => {
    fetchEligibility()
  }, [])

  const fetchEligibility = async () => {
    setLoading(true)
    try {
      const data = await apiCall("/loans/eligibility")
      setEligibility(data)
      if (data.available_amounts?.length > 0) {
        setSelectedAmount(data.available_amounts[0])
      }
    } catch (err) {
      showNotification("Could not load eligibility: " + err.message, "error")
      // Leave eligibility as null — component will show the retry state
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedAmount) return
    setSubmitting(true)
    try {
      const loan = await apiCall("/loans/apply", {
        method: "POST",
        body: JSON.stringify({
          amount_requested: selectedAmount,
          loan_tenure_days: tenure,
        }),
      })
      showNotification(`✅ Loan of GHS ${loan.amount_approved?.toFixed(2)} approved!`, "success")
      navigate("/loans/" + loan.id)
    } catch (err) {
      showNotification("Application failed: " + err.message, "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="font-medium text-sm">Checking your eligibility…</p>
      </div>
    )
  }

  // API failed — show a retry screen instead of a broken not-eligible screen
  if (!eligibility) {
    return (
      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto w-full">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 text-center space-y-4">
          <p className="font-bold text-rose-800">Could not load your eligibility</p>
          <p className="text-rose-600 text-sm">Check your connection and try again.</p>
          <button
            onClick={fetchEligibility}
            className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-sky-600 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Not eligible screen ────────────────────────────────────────────────────
  if (!eligibility?.eligible) {
    return <NotEligibleScreen eligibility={eligibility} />
  }

  // ── Eligible screen ────────────────────────────────────────────────────────
  const rate = eligibility.interest_rate_pct / 100
  const interest = selectedAmount ? selectedAmount * rate : 0
  const originationFee = selectedAmount ? selectedAmount * 0.025 : 0
  const totalDue = selectedAmount ? selectedAmount + interest + originationFee : 0

  return (
    <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Score badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-emerald-800">
            You qualify — {eligibility.band} ({eligibility.score} pts)
          </p>
          <p className="text-xs text-emerald-600">
            Max loan: GHS {eligibility.max_loan_ghs.toFixed(0)} · {eligibility.interest_rate_pct}% interest
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amount selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6"
        >
          <div className="text-center space-y-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Amount</p>
            <div className="text-6xl font-black tracking-tighter text-slate-800">
              <span className="text-slate-400 text-3xl mr-2 font-bold tracking-normal">GHS</span>
              {selectedAmount ?? "—"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {eligibility.available_amounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedAmount(preset)}
                  className={`py-4 px-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] ${
                    selectedAmount === preset
                      ? "bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  GHS {preset}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 font-medium">
              Amounts available for your score band
            </p>
          </div>

          {/* Tenure selector */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Repayment period</p>
            <div className="grid grid-cols-4 gap-2">
              {TENURE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    tenure === t
                      ? "bg-slate-800 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {t}d
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Breakdown + submit */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 flex flex-col justify-between"
        >
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold">Loan Breakdown</h3>
            <Row label={`Interest (${eligibility.interest_rate_pct}%)`} value={`GHS ${interest.toFixed(2)}`} />
            <Row label="Origination Fee (2.5%)" value={`GHS ${originationFee.toFixed(2)}`} />
            <div className="h-px w-full bg-slate-100" />
            <div className="flex justify-between items-center">
              <div>
                <span className="text-slate-800 font-bold block">Total Due</span>
                <span className="text-slate-400 text-xs">Due in {tenure} days</span>
              </div>
              <span className="text-xl font-black text-primary">GHS {totalDue.toFixed(2)}</span>
            </div>
            <div className="h-px w-full bg-slate-100" />
            <p className="text-xs text-slate-400">
              Facilitated by <span className="font-semibold text-slate-500">{eligibility.partner_name}</span>
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedAmount || submitting}
            className={`group w-full font-bold rounded-2xl py-5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg ${
              selectedAmount && !submitting
                ? "bg-primary hover:bg-sky-600 text-white shadow-primary/25"
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting…</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ── Not Eligible Screen ────────────────────────────────────────────────────────

function NotEligibleScreen({ eligibility }) {
  const navigate = useNavigate()
  const [expandedTip, setExpandedTip] = useState(null)

  const hasScore = eligibility?.has_score
  const score = eligibility?.score
  const reason = eligibility?.decline_reason
  const tips = eligibility?.tips ?? []

  return (
    <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto w-full">

      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-amber-50 border border-amber-100 rounded-3xl p-6 space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2.5 rounded-full flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-amber-900">
              {hasScore ? "Not Yet Eligible" : "No Score Found"}
            </p>
            {hasScore && score !== null && (
              <p className="text-amber-700 text-sm mt-0.5">Current score: <strong>{score}</strong> / 850</p>
            )}
            <p className="text-amber-700 text-sm mt-1">{reason}</p>
          </div>
        </div>

        {hasScore && score !== null && (
          <div className="pt-1">
            <div className="flex justify-between text-xs text-amber-600 font-medium mb-1.5">
              <span>{score} pts</span>
              <span>500 needed</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((score / 850) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-amber-400 h-2 rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Tips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">How to build your score</h2>
        </div>

        <div className="space-y-2">
          {tips.map((tip, i) => (
            <motion.button
              key={i}
              onClick={() => setExpandedTip(expandedTip === i ? null : i)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3 hover:border-primary/30 transition-colors"
            >
              <div className="bg-primary/10 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                <Lightbulb className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed flex-1">{tip}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/score")}
        className="group w-full bg-primary hover:bg-sky-600 text-white font-bold rounded-2xl py-5 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/25"
      >
        <span>Upload MoMo Statement</span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  )
}
