import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Apply() {
  const [amount, setAmount] = useState(500)
  const maxAmount = 1000

  return (
    <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">Request Loan</h1>
        <p className="text-slate-500 text-sm">Disbursed instantly to your MoMo wallet.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Amount Selector */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8 flex flex-col justify-center"
        >
          <div className="text-center space-y-2">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Amount</p>
            <div className="text-6xl font-black tracking-tighter text-slate-800">
              <span className="text-slate-400 text-3xl mr-2 font-bold tracking-normal">GHS</span>
              {amount}
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {[100, 250, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`py-4 px-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] ${
                    amount === preset 
                      ? "bg-primary text-white shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-white" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  GHS {preset}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 font-medium">
              Select an eligible amount
            </p>
          </div>
        </motion.div>

        {/* Right Column: Breakdown & Submit */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 flex flex-col justify-between"
        >
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-slate-800 font-bold mb-4">Loan Breakdown</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Interest (5%)</span>
              <span className="font-bold text-slate-800">GHS {(amount * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Origination Fee (2.5%)</span>
              <span className="font-bold text-slate-800">GHS {(amount * 0.025).toFixed(2)}</span>
            </div>
            <div className="h-[1px] w-full bg-slate-100 my-4" />
            <div className="flex justify-between items-center">
              <div>
                <span className="text-slate-800 font-bold block">Total Due</span>
                <span className="text-slate-400 text-xs">Due in 30 Days</span>
              </div>
              <span className="text-xl font-black text-primary">GHS {(amount * 1.075).toFixed(2)}</span>
            </div>
          </div>

          <button className="group w-full bg-primary hover:bg-sky-600 text-white font-bold rounded-2xl py-5 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/25">
            <span>Submit Application</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
