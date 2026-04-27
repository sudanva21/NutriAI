import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, RefreshCw, Zap, Check, AlertCircle } from "lucide-react";
import { analyzeFoodImage } from "../services/geminiService";
import { cn } from "../lib/utils";

interface ScannerProps {
  onClose: () => void;
  onResult: (result: any) => void;
}

export default function Scanner({ onClose, onResult }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    try {
      const result = await analyzeFoodImage(capturedImage);
      if (result) {
        onResult(result);
      } else {
        setError("AI failed to analyze the image. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalyzing(false);
    setError(null);
    startCamera();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Neural Scanner</h2>
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Vision Logic Engine v1.0</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Viewfinder */}
      <div className="flex-1 relative overflow-hidden mx-4 rounded-3xl border border-white/10 bg-black shadow-2xl">
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Scanner Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  
                  {/* Scanning Line Animation */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(79,70,229,0.8)]"
                  />
                </div>
              </div>
              <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Align food within focus frame</p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-full h-full">
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-10">
                <div className="relative mb-8">
                  <RefreshCw className="w-16 h-16 text-primary animate-spin" />
                  <Zap className="absolute inset-0 m-auto w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-2">Deconstructing Atoms</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Cross-referencing metabolic database for nutrient density...</p>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-10 text-white">
            <AlertCircle className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-tighter mb-2">System Error</h3>
            <p className="text-xs font-bold opacity-80 mb-8">{error}</p>
            <button 
              onClick={startCamera}
              className="px-8 py-3 bg-white text-red-900 rounded-lg font-black text-[10px] uppercase tracking-widest"
            >
              Restart Module
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <footer className="p-10 flex items-center justify-center gap-10">
        {!capturedImage ? (
          <button 
            onClick={captureImage}
            disabled={!!error}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-90 transition-all disabled:opacity-20"
          >
            <div className="w-16 h-16 rounded-full border-4 border-navy flex items-center justify-center">
               <Camera className="w-8 h-8 text-navy" />
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-6">
            <button 
              onClick={reset}
              disabled={analyzing}
              className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-20"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-10 h-14 bg-primary text-white rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {analyzing ? (
                "Processing..."
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Log Molecular Data
                </>
              )}
            </button>
          </div>
        )}
      </footer>

      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
