import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, User, Phone, Wallet, Signal } from "lucide-react"
import logoWithName from "../assets/8.svg"

export default function Register() {
  const [step, setStep] = useState(1)
  
  // Form State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [momoNetwork, setMomoNetwork] = useState("MTN")
  const [walletNumber, setWalletNumber] = useState("")
  const [otp, setOtp] = useState("")
  
  const navigate = useNavigate()

  const isStep1Valid = fullName.length >= 3 && phone.length >= 10 && walletNumber.length >= 10

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2)
    } else if (step === 2 && otp.length === 6) {
      navigate("/dashboard")
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-6 py-8 justify-between max-w-xl mx-auto w-full">
      <div className="space-y-8 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logoWithName} alt="CreditPrint" className="h-14 w-auto mb-8" />
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-800">
            {step === 1 ? "Create Account" : "Verify code"}
          </h1>
          <p className="text-slate-500 text-sm">
            {step === 1 
              ? "Tell us about yourself to get started."
              : `Code sent to ${phone}`
            }
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. 0541234567)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                  />
                </div>

                <div className="flex space-x-3">
                  <div className="relative flex-[0.4]">
                    <Signal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      value={momoNetwork}
                      onChange={(e) => setMomoNetwork(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-2 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    >
                      <option value="MTN">MTN</option>
                      <option value="TELECEL">Telecel</option>
                      <option value="AIRTELTIGO">AirtelTigo</option>
                    </select>
                  </div>

                  <div className="relative flex-[0.6]">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="Wallet Number"
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-6 text-center text-3xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-200 shadow-sm font-bold text-slate-800"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pb-safe pt-8"
      >
        <button
          onClick={handleNext}
          disabled={step === 1 && !isStep1Valid}
          className={`w-full font-semibold rounded-xl py-4 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
            (step === 1 && !isStep1Valid) 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-sky-600 text-white shadow-lg shadow-primary/30'
          }`}
        >
          <span>{step === 1 ? "Continue" : "Verify & Login"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  )
}
