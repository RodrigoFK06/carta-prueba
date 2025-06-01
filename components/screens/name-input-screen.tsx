"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface NameInputScreenProps {
  onSubmit: (name: string) => void
  onBack: () => void
  onAdminAccess: () => void // Nueva prop para acceso admin
}

export default function NameInputScreen({ onSubmit, onBack, onAdminAccess }: NameInputScreenProps) {
  const [name, setName] = useState("Rodri")

  const handleSubmit = () => {
    if (name.trim()) {
      // Verificar código de administrador
      if (name.trim().toLowerCase() === "admin123") {
        onAdminAccess()
        return
      }
      onSubmit(name.trim())
    }
  }

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
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full border-4 border-blue-600 flex items-center justify-center mb-6">
            <span className="text-4xl">😊</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-blue-600 mb-2">¡Hola!</h1>
          <p className="text-lg text-gray-600">¿Cuál es tu nombre?</p>
          <p className="text-xs text-gray-400 mt-2">Tip: Ingresa "admin123" para modo administrador</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm mb-8"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="text-center text-lg py-6 border-b-2 border-t-0 border-l-0 border-r-0 border-blue-600 rounded-none bg-transparent focus:ring-0 focus:border-blue-600"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 w-full max-w-sm"
        >
          <Button
            variant="outline"
            onClick={() => setName("")}
            className="flex-1 py-3 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            OMITIR
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            CONFIRMAR
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
