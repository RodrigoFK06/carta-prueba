"use client"

import { motion } from "framer-motion"
import { ChefHat } from "lucide-react"

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-white"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-transparent"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #10b981, #3b82f6)",
            borderRadius: "50%",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
