import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, User, Phone, Wallet, Signal } from "lucide-react"
import { apiCall } from "../lib/api"
import logoWithName from "../assets/8.svg"
import signupIllustration from "../assets/Signup Illustration.png"

export default function Register() {
  const [step, setStep] = useState(1)

  // Form State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [momoNetwork, setMomoNetwork] = useState("MTN")
  const [walletNumber, setWalletNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const isStep1Valid = fullName.length >= 3 && phone.length >= 10 && walletNumber.length >= 10

  const handleRegisterSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          phone_number: phone,
          full_name: fullName,
          momo_network: momoNetwork,
          wallet_number: walletNumber
        })
      })
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySubmit = async () => {
    setError("")
    setLoading(true)
    try {
      const data = await apiCall("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ phone_number: phone, otp })
      })
      localStorage.setItem("moscore_token", data.access_token)
      localStorage.setItem("moscore_user", JSON.stringify({ id: data.user_id, name: data.full_name }))
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      handleRegisterSubmit()
    } else if (step === 2 && otp.length === 6) {
      handleVerifySubmit()
    }
  }

  return (
    <div className="min-h-screen bg-background flex font-sans relative">

      {/* Mobile Background Illustration removed as requested */}

      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 relative z-20">

        <div className="w-full max-w-md mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-block mb-10">
              <img src={logoWithName} alt="CreditPrint" className="h-12 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-slate-900 drop-shadow-sm">
              {step === 1 ? "Create Account" : "Verify code"}
            </h1>
            <p className="text-slate-600 text-base font-medium">
              {step === 1
                ? "Tell us about yourself to get started."
                : `We've sent a 6-digit code to ${phone}.`
              }
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center shadow-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6 bg-white/40 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 -mx-6 rounded-3xl lg:p-0 lg:mx-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:shadow-none border border-white/50 lg:border-none">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-5">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm text-lg font-medium"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="tel"
                        placeholder="Phone (e.g. 0541234567)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm text-lg font-medium"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 sm:space-x-4">
                      <div className="relative sm:flex-[0.4]">
                        <Signal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select
                          value={momoNetwork}
                          onChange={(e) => setMomoNetwork(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-lg font-medium appearance-none cursor-pointer"
                        >
                          <option value="MTN">MTN</option>
                          <option value="TELECEL">Telecel</option>
                          <option value="AIRTELTIGO">AirtelTigo</option>
                        </select>
                      </div>

                      <div className="relative sm:flex-[0.6]">
                        <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="tel"
                          placeholder="Wallet Number"
                          value={walletNumber}
                          onChange={(e) => setWalletNumber(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm text-lg font-medium"
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
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-6 text-center text-4xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-200 shadow-sm font-bold text-slate-800"
                    autoFocus
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      Change details
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-4 space-y-6"
            >
              <button
                onClick={handleNext}
                disabled={loading || (step === 1 && !isStep1Valid) || (step === 2 && otp.length !== 6)}
                className={`w-full font-bold rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] text-lg ${loading || (step === 1 && !isStep1Valid) || (step === 2 && otp.length !== 6)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primaryHover text-white shadow-xl shadow-primary/30'
                  }`}
              >
                <span>{loading ? "Please wait..." : (step === 1 ? "Continue" : "Verify & Register")}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              {step === 1 && (
                <div className="text-center">
                  <span className="text-slate-600 font-medium drop-shadow-sm">Already have an account? </span>
                  <Link to="/login" className="text-primary font-bold hover:text-primaryHover transition-colors drop-shadow-sm">
                    Log in
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Column - Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-surface relative items-center justify-center overflow-hidden border-l border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-pink-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 p-12 max-w-2xl"
        >
          <img
            src={signupIllustration}
            alt="Signup Illustration"
            className="w-full h-auto object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
          />
        </motion.div>
      </div>

    </div>
  )
}
