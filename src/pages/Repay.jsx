import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Clock, ArrowUpRight, AlertCircle, ExternalLink, ChevronRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { apiCall } from "../lib/api"

export default function Repay() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const data = await apiCall("/loans/my")
      setLoans(data)
    } catch (err) {
      setError("Failed to load loan history")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const activeStatuses = ["DISBURSED", "PENDING"]
  const activeLoan = loans.find(l => activeStatuses.includes(l.status))
  const historyLoans = loans.filter(l => !activeStatuses.includes(l.status))

  const handlePayNow = async () => {
    if (!activeLoan) return
    try {
      setPaying(true)
      await apiCall(`/loans/${activeLoan.id}/collect-repayment`, { method: "POST" })
      // Alert the user that a USSD prompt was sent
      alert("A payment prompt has been sent to your Mobile Money number. Please approve it to complete repayment.")
      // We could start polling here, but for now just refresh
      fetchLoans()
    } catch (err) {
      alert(err.message || "Failed to initiate payment")
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-12 flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-6 space-y-8 max-w-5xl mx-auto w-full pb-24">
      {/* Remove duplicate header, let MobileLayout handle it */}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Next Due Card */}
        <div className="md:col-span-5">
          {error && (
             <div className="mb-4 bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-600">
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <p className="text-sm font-medium">{error}</p>
             </div>
          )}

          {activeLoan ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 border-2 border-primary/10 shadow-lg shadow-primary/5 space-y-8 sticky top-8"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 bg-sky-50 px-2.5 py-1 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Active Loan</p>
                  </div>
                  {/* Calculate total due = principal + interest */}
                  <p className="text-4xl font-black tracking-tight text-slate-800">
                    GHS {(activeLoan.amount_approved * (1 + activeLoan.interest_rate)).toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    Due by {new Date(new Date(activeLoan.approved_at).getTime() + activeLoan.loan_tenure_days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-sky-50 p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handlePayNow}
                  disabled={paying}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-70"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Initiating...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Now</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => navigate(`/loans/${activeLoan.id}`)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold rounded-2xl py-3 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">No Active Loans</h3>
                <p className="text-slate-500 text-sm mt-1">You don't have any pending repayments. You can apply for a new loan.</p>
              </div>
              <button 
                onClick={() => navigate('/apply')}
                className="text-primary font-bold bg-sky-50 px-6 py-3 rounded-xl hover:bg-sky-100 transition-colors"
              >
                Apply for a Loan
              </button>
            </div>
          )}
        </div>

        {/* Right Column: History */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800">Payment History</h2>
          
          {historyLoans.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {historyLoans.map((l) => (
                  <HistoryItem 
                    key={l.id} 
                    loan={l}
                    onClick={() => navigate(`/loans/${l.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
               <p className="text-slate-500 text-sm">No payment history yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HistoryItem({ loan, onClick }) {
  const isPaid = loan.status === "REPAID"
  const isDeclined = loan.status === "DECLINED"
  const total = loan.amount_approved ? (loan.amount_approved * (1 + (loan.interest_rate || 0))).toFixed(2) : loan.amount_requested.toFixed(2)

  return (
    <div 
      onClick={onClick}
      className="p-4 sm:p-5 flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center space-x-4">
        <div className={`rounded-full p-2.5 ${isPaid ? 'bg-emerald-50' : isDeclined ? 'bg-rose-50' : 'bg-slate-50'}`}>
          {isPaid ? (
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : isDeclined ? (
             <AlertCircle className="w-5 h-5 text-rose-500" />
          ) : (
             <Clock className="w-5 h-5 text-slate-500" />
          )}
        </div>
        <div>
          <p className="font-bold text-slate-800">GHS {total}</p>
          <p className="text-xs font-medium text-slate-500">
            {new Date(loan.applied_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
          isPaid ? 'bg-emerald-50 text-emerald-600' : 
          isDeclined ? 'bg-rose-50 text-rose-600' : 
          'bg-slate-100 text-slate-600'
        }`}>
          {loan.status}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  )
}
