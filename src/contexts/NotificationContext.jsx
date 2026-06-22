import React, { createContext, useContext, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null)

  const showNotification = useCallback((message, type = "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 7000)
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {createPortal(
        <AnimatePresence>
          {notification && (
            <div className="fixed top-4 left-4 right-4 z-[9999] pointer-events-none flex justify-center">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-start space-x-3 w-full max-w-sm ${
                  notification.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {notification.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 text-sm font-medium leading-relaxed">{notification.message}</div>
                <button 
                  onClick={() => setNotification(null)} 
                  className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                    notification.type === "error" ? "hover:bg-rose-600" : "hover:bg-emerald-600"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
