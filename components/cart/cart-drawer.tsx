"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  setCart: (cart: any[]) => void
}

export default function CartDrawer({ isOpen, onClose, cart, setCart }: CartDrawerProps) {
  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter(Boolean),
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Mi Pedido</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-96 p-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">S/ {formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">S/ {formatPrice(getTotalPrice())}</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full">
                Confirmar Pedido
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
