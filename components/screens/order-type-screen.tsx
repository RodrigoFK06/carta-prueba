"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Store, ShoppingBag } from "lucide-react"

interface OrderTypeScreenProps {
  onSelect: (type: "local" | "takeaway") => void
  onBack: () => void
}

export default function OrderTypeScreen({ onSelect, onBack }: OrderTypeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-white"
    >
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center px-6 mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold text-gray-800 text-center mb-16"
        >
          ¿Dónde deseas comer?
        </motion.h1>

        <div className="grid grid-cols-1 gap-8 w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button
              onClick={() => onSelect("local")}
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center gap-4 border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <Store className="w-12 h-12 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">En el local</span>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Button
              onClick={() => onSelect("takeaway")}
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center gap-4 border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <ShoppingBag className="w-12 h-12 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Take away</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
