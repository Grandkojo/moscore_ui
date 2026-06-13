import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Shield, Zap, Lock, Mail, Globe, MessageCircle } from "lucide-react"
import logoWithName from "../assets/8.svg"
import heroIllustration from "../assets/Homepage Hero Illustration.png"

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fafcff] flex flex-col font-sans overflow-x-hidden selection:bg-primary/20">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-6 max-w-7xl mx-auto w-full z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img src={logoWithName} alt="MoScore" className="h-10 lg:h-12 w-auto" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center space-x-2 sm:space-x-6"
        >
          <Link to="/login" className="text-slate-600 font-semibold hover:text-primary transition-colors px-4 py-2 text-sm sm:text-base">
            Log in
          </Link>
          <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold shadow-xl shadow-slate-900/20 transition-all active:scale-95 text-sm sm:text-base">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative pt-10 pb-20 lg:pt-16 lg:pb-32">
        {/* Modern Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 grid xl:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center relative z-10">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="space-y-8 text-center xl:text-left max-w-2xl mx-auto xl:mx-0"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Unlock Your <br className="hidden xl:block" />
              <span className="relative inline-block mt-2 xl:mt-0">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-purple-600">
                  Financial Potential
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-4 bg-primary/10 -rotate-2 scale-105 z-0 rounded-full"></span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium">
              Analyze your mobile money statements, build a verified credit score, and access the loans you deserve. Fast, secure, and fully automated.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start space-y-4 sm:space-y-0 sm:space-x-5 pt-4">
              <Link to="/register" className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0">
                <span>Start Building Score</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* <div className="pt-10 flex flex-wrap items-center justify-center xl:justify-start gap-6 sm:gap-10 text-sm text-slate-600 font-semibold">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                <span>100% Private</span>
              </div>
            </div> */}
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center lg:h-[600px] w-full"
          >
            {/* Soft backdrop shape */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-blue-50 to-purple-50 rounded-[4rem] rotate-3 scale-105 transition-transform duration-700 hover:rotate-6"></div>

            <img
              src={heroIllustration}
              alt="Hero Illustration"
              className="relative z-10 w-full max-w-md lg:max-w-xl xl:max-w-2xl h-auto object-contain drop-shadow-[0_20px_50px_rgba(14,165,233,0.15)] hover:-translate-y-4 transition-transform duration-700 ease-out"
            />
          </motion.div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <img src={logoWithName} alt="MoScore" className="h-8 brightness-0 invert opacity-90" />
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Empowering individuals with reliable credit scores derived from mobile money transactions.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold tracking-wide text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-primary transition-colors">Log in</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-semibold tracking-wide text-sm">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} MoScore. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
