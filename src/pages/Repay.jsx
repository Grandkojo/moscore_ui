import { motion } from "framer-motion"
import { CheckCircle2, Clock, ArrowUpRight } from "lucide-react"

export default function Repay() {
  return (
    <div className="px-6 py-8 space-y-8 max-w-5xl mx-auto w-full">
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">Repayments</h1>
        <p className="text-slate-500 text-sm">Manage your active loans and schedule.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Next Due Card */}
        <div className="md:col-span-5">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 md:p-8 border-2 border-primary/10 shadow-lg shadow-primary/5 space-y-8 sticky top-8"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 bg-sky-50 px-2.5 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Next Due</p>
                </div>
                <p className="text-4xl font-black tracking-tight text-slate-800">GHS 537.50</p>
                <p className="text-sm font-medium text-slate-500">Due on Aug 12, 2026</p>
              </div>
              <div className="bg-sky-50 p-3 rounded-2xl">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-md">
              <span>Pay Now</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: History */}
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800">Payment History</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              <HistoryItem amount="216.00" date="Jul 12, 2026" status="Paid" />
              <HistoryItem amount="108.00" date="Jun 12, 2026" status="Paid" />
              <HistoryItem amount="54.00" date="May 12, 2026" status="Paid" />
              <HistoryItem amount="16.00" date="Apr 12, 2026" status="Paid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryItem({ amount, date, status }) {
  return (
    <div className="p-4 sm:p-5 flex justify-between items-center hover:bg-slate-50 transition-colors cursor-default">
      <div className="flex items-center space-x-4">
        <div className="bg-emerald-50 rounded-full p-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p className="font-bold text-slate-800">GHS {amount}</p>
          <p className="text-xs font-medium text-slate-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
          {status}
        </span>
      </div>
    </div>
  )
}
