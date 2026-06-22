import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Calendar, CreditCard, ChevronRight, Loader2 } from "lucide-react"
import { apiCall } from "../lib/api"

export default function PaymentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loan, setLoan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetchLoan()
  }, [id])

  const fetchLoan = async () => {
    try {
      setLoading(true)
      const data = await apiCall(`/loans/${id}`)
      setLoan(data)
    } catch (err) {
      setError(err.message || "Failed to load loan details")
    } finally {
      setLoading(false)
    }
  }

  const handlePayNow = async () => {
    if (!loan || loan.status !== "DISBURSED") return
    try {
      setPaying(true)
      await apiCall(`/loans/${loan.id}/collect-repayment`, { method: "POST" })
      alert("A payment prompt has been sent to your Mobile Money number. Please approve it to complete repayment.")
      fetchLoan()
    } catch (err) {
      alert(err.message || "Failed to initiate payment")
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !loan) {
    return (
      <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-rose-500 font-medium">{error || "Loan not found"}</p>
        <button onClick={() => navigate('/repay')} className="text-primary font-bold px-4 py-2 bg-sky-50 rounded-lg">Go back</button>
      </div>
    )
  }

  const principal = loan.amount_approved || loan.amount_requested
  const interestRate = loan.interest_rate || 0
  const interestAmount = principal * interestRate
  const totalDue = principal + interestAmount
  
  let dueDate = null
  if (loan.approved_at) {
    dueDate = new Date(new Date(loan.approved_at).getTime() + loan.loan_tenure_days * 24 * 60 * 60 * 1000)
  }

  const isPaid = loan.status === "REPAID"
  const isDeclined = loan.status === "DECLINED"
  const isActive = loan.status === "DISBURSED"

  return (
    <div className="px-6 py-6 space-y-8 max-w-3xl mx-auto w-full pb-24">
      {/* Header handled by MobileLayout. Just the content here. */}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <p className="text-slate-500 font-medium uppercase tracking-wider text-xs">Total Amount</p>
          <h2 className="text-5xl font-black tracking-tighter text-slate-800">
            GHS {totalDue.toFixed(2)}
          </h2>
          <div className="inline-flex items-center gap-2 mt-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isPaid ? 'bg-emerald-50 text-emerald-600' : 
              isDeclined ? 'bg-rose-50 text-rose-600' : 
              'bg-sky-50 text-primary'
            }`}>
              {loan.status}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <DetailRow label="Principal" value={`GHS ${principal.toFixed(2)}`} />
          <DetailRow label={`Interest (${(interestRate * 100).toFixed(0)}%)`} value={`GHS ${interestAmount.toFixed(2)}`} />
          {dueDate && (
            <DetailRow label="Due Date" value={dueDate.toLocaleDateString()} highlight={isActive} />
          )}
          <DetailRow label="Applied On" value={new Date(loan.applied_at).toLocaleDateString()} />
          {loan.partner_reference && (
             <DetailRow label="Partner Ref" value={loan.partner_reference} />
          )}
        </div>

        {isDeclined && loan.decline_reason && (
          <div className="bg-rose-50 p-4 rounded-xl text-rose-700 text-sm">
            <span className="font-bold">Reason:</span> {loan.decline_reason}
          </div>
        )}

        {isActive && (
          <div className="pt-4">
            <button 
              onClick={handlePayNow}
              disabled={paying}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Initiating...</span>
                </>
              ) : (
                <span>Pay Now via MoMo</span>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {/* Payment Timeline / Instructions */}
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
      >
        <h3 className="font-bold text-slate-800 mb-4 px-2">Loan Timeline</h3>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <TimelineItem 
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            title="Loan Applied"
            date={new Date(loan.applied_at).toLocaleString()}
            done={true}
          />
          {loan.approved_at && (
            <TimelineItem 
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
              title="Loan Approved & Disbursed"
              date={new Date(loan.approved_at).toLocaleString()}
              done={true}
            />
          )}
          {isPaid && (
            <TimelineItem 
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
              title="Loan Repaid"
              date="Completed"
              done={true}
              isLast
            />
          )}
          {isActive && (
            <TimelineItem 
              icon={<Clock className="w-5 h-5 text-slate-400" />}
              title="Awaiting Repayment"
              date={`Due by ${dueDate?.toLocaleDateString()}`}
              done={false}
              isLast
            />
          )}
          {isDeclined && (
            <TimelineItem 
              icon={<AlertCircle className="w-5 h-5 text-white" />}
              title="Application Declined"
              date="Check reason above"
              done={true}
              isLast
              color="bg-rose-500"
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold ${highlight ? 'text-rose-600' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}

function TimelineItem({ icon, title, date, done, isLast, color = "bg-emerald-500" }) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className={`absolute top-8 left-[19px] bottom-[-24px] w-0.5 ${done ? 'bg-emerald-500' : 'bg-slate-100'}`} />
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done ? color : 'bg-slate-100 border-2 border-slate-200'}`}>
        {icon}
      </div>
      <div className="pt-2">
        <p className={`font-bold text-sm ${done ? 'text-slate-800' : 'text-slate-500'}`}>{title}</p>
        <p className="text-xs text-slate-500 mt-1">{date}</p>
      </div>
    </div>
  )
}
