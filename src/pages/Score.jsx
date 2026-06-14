import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { UploadCloud, TrendingUp, TrendingDown, Target, X } from "lucide-react"
import { scoreService } from "../lib/score"
import { useNotification } from "../contexts/NotificationContext"

export default function Score() {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const data = await scoreService.getHistory()
      setHistory(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      await scoreService.upload(selectedFile)
      await fetchHistory()
      setSelectedFile(null)
    } catch (err) {
      showNotification("Upload failed: " + err.message, "error")
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        showNotification("Please upload a valid PDF file.", "error")
      }
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        showNotification("Please upload a valid PDF file.", "error")
      }
    }
  }

  return (
    <div className="px-6 py-8 space-y-8 max-w-5xl mx-auto w-full relative">
      <header>
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-slate-800">Calculate Score</h1>
        <p className="text-slate-500 text-sm">Upload your MoMo statement to update your Credit score.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Upload Zone */}
        <div className="md:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6"
          >
            <h2 className="text-lg font-bold tracking-tight text-slate-800">Upload Statement</h2>
            
            <form 
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onSubmit={(e) => e.preventDefault()}
              className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-colors ${
                dragActive 
                  ? "border-primary bg-sky-50" 
                  : "border-slate-300 hover:border-primary/50 bg-slate-50/50"
              }`}
            >
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
                <UploadCloud className={`w-8 h-8 ${dragActive || selectedFile ? "text-primary" : "text-slate-400"}`} />
              </div>
              
              <div className="text-center space-y-2 w-full px-4 overflow-hidden">
                {selectedFile ? (
                   <div className="flex flex-col items-center gap-2">
                     <p className="font-bold text-slate-700 w-full truncate px-2" title={selectedFile.name}>
                       {selectedFile.name}
                     </p>
                     <button 
                       type="button" 
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(null); }}
                       className="text-xs font-bold bg-slate-200 text-slate-600 hover:bg-rose-100 hover:text-rose-600 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 z-10 relative"
                     >
                       <X className="w-3 h-3" /> Remove File
                     </button>
                   </div>
                ) : (
                   <p className="font-bold text-slate-700">Tap to upload or drag & drop</p>
                )}
                
                <p className="text-sm font-medium text-slate-400">
                  {selectedFile ? "Ready to analyze" : "PDF files only, max 10MB"}
                </p>
              </div>
            </form>

            <button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`w-full font-bold rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
                selectedFile && !uploading
                  ? 'bg-primary hover:bg-sky-600 text-white shadow-lg shadow-primary/30' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{uploading ? "Analyzing..." : "Analyze Statement"}</span>
              <Target className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: History */}
        <div className="md:col-span-5 space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800">Previous Scores</h2>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-slate-400 font-medium">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">No previous scores found.</div>
              ) : (
                history.map((score, idx) => {
                  const prevScore = history[idx + 1]
                  return (
                    <ScoreHistoryItem 
                      key={score.computed_at || idx} 
                      scoreData={score} 
                      prevScoreData={prevScore} 
                      onClick={() => navigate('/score/details', { state: { score } })}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function ScoreHistoryItem({ scoreData, prevScoreData, onClick }) {
  const isUp = prevScoreData ? scoreData.score >= prevScoreData.score : true
  const date = new Date(scoreData.computed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  
  return (
    <div onClick={onClick} className="p-4 sm:p-5 flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100">
      <div className="flex items-center space-x-4">
        <div className={`rounded-full p-2.5 ${isUp ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          {isUp ? (
            <TrendingUp className={`w-5 h-5 text-emerald-500`} />
          ) : (
            <TrendingDown className={`w-5 h-5 text-rose-500`} />
          )}
        </div>
        <div>
          <p className="font-bold text-slate-800">{scoreData.score} points</p>
          <p className="text-xs font-medium text-slate-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isUp ? '+ Increase' : '- Decrease'}
        </span>
      </div>
    </div>
  )
}



