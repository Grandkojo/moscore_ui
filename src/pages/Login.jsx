import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"
import { apiCall } from "../lib/api"
import logoWithName from "../assets/8.svg"
import loginIllustration from "../assets/Login Illustration.png"

export default function Login() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form State
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")

  const navigate = useNavigate()

  const isStep1Valid = phone.length >= 10

  const handleLoginSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone_number: phone })
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
      handleLoginSubmit()
    } else if (step === 2 && otp.length === 6) {
      handleVerifySubmit()
    }
  }

  return (
    <div className="min-h-screen bg-background flex font-sans relative">

      {/* Mobile Background Illustration removed as requested */}

      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-start pt-8 lg:justify-center px-6 pb-12 lg:py-12 lg:px-16 xl:px-24 relative z-20">

        <div className="w-full max-w-md mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-block mb-10">
              <img src={logoWithName} alt="MoScore" className="h-12 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-slate-900 drop-shadow-sm">
              {step === 1 ? "Welcome Back" : "Verify code"}
            </h1>
            <p className="text-slate-600 text-base font-medium">
              {step === 1
                ? "Enter your phone number to access your account."
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

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="Phone  (e.g. 0541234567)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm text-lg font-medium"
                    />
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
                      Change phone number
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
                <span>{loading ? "Please wait..." : (step === 1 ? "Continue" : "Verify & Login")}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              {step === 1 && (
                <div className="text-center">
                  <span className="text-slate-600 font-medium drop-shadow-sm">Don't have an account? </span>
                  <Link to="/register" className="text-primary font-bold hover:text-primaryHover transition-colors drop-shadow-sm">
                    Sign up
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Column - Illustration (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-surface relative items-center justify-center overflow-hidden border-l border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 p-12 max-w-2xl"
        >
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="w-full h-auto object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
          />
        </motion.div>
      </div>

    </div>
  )
}
