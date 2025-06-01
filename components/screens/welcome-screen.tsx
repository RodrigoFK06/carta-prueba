"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onNext: () => void
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-600">NT</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">¡Bienvenido a nuestra</h1>
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Carta Digital!</h2>
        <p className="text-gray-600 max-w-sm">Disfruta de la mejor comida en el mejor lugar, en la palma de tu mano</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">NT</span>
          </div>
          <span className="font-semibold text-gray-800">MESA 1</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
        >
          ¡QUIERO VER LA CARTA!
        </Button>
      </motion.div>
    </motion.div>
  )
}
