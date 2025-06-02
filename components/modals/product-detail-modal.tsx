"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Minus, ChevronDown } from "lucide-react"
import Image from "next/image"
import { recordAddToCartAction } from "@/app/actions/menuActions"

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    variants?: string[]
    type?: "single" | "multiple" // Nuevo campo para determinar el tipo de modal
  }
  onAddToCart: (item: any, quantity: number, selectedVariants?: any, instructions?: string) => void
}

export default function ProductDetailModal({ isOpen, onClose, product, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;
  const [instructions, setInstructions] = useState("")

  // Para productos simples (un solo selector)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [isVariantOpen, setIsVariantOpen] = useState(false)

  // Para productos múltiples (contadores individuales por variante)
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({})

  const isMultipleVariantProduct =
    product.type === "multiple" ||
    (product.category === "PROMOS" && product.variants) ||
    product.name.toLowerCase().includes("nigiri") ||
    product.name.toLowerCase().includes("maki")

  const handleVariantQuantityChange = (variant: string, change: number) => {
    setVariantQuantities((prev) => {
      const currentQty = prev[variant] || 0
      const newQty = Math.max(0, currentQty + change)
      return { ...prev, [variant]: newQty }
    })
  }

  const getTotalQuantity = () => {
    if (isMultipleVariantProduct) {
      return Object.values(variantQuantities).reduce((sum, qty) => sum + qty, 0)
    }
    return quantity
  }

  const getTotalPrice = () => {
    return parseFloat(product.price as any) * getTotalQuantity()
  }

  const handleAddToCart = () => {
    const totalQty = getTotalQuantity(); // Get total quantity before further logic

    // Record the action
    if (product && product.id && totalQty > 0) {
      recordAddToCartAction(product.id, totalQty).then(response => {
        if (!response.success) {
          console.warn(`Failed to record add_to_cart for ${product.id} (qty: ${totalQty}): ${response.error}`);
        }
      });
    }

    if (isMultipleVariantProduct) {
      // Para productos con variantes múltiples
      const selectedVariants = Object.entries(variantQuantities)
        .filter(([_, qty]) => qty > 0)
        .reduce((acc, [variant, qty]) => ({ ...acc, [variant]: qty }), {})

      if (Object.keys(selectedVariants).length === 0) return

      onAddToCart(product, getTotalQuantity(), selectedVariants, instructions)
    } else {
      // Para productos simples
      if (!selectedVariant && product.variants && product.variants.length > 0) return
      onAddToCart(product, quantity, selectedVariant, instructions)
    }

    onClose()
    // Reset form
    setQuantity(1)
    setSelectedVariant("")
    setInstructions("")
    setVariantQuantities({})
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=400"}
              alt={product.name}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{product.name}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-12rem)] overflow-y-auto">
            <p className="text-gray-600">{product.description}</p>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                {isMultipleVariantProduct ? (
                  // Modal para productos con variantes múltiples
                  <div className="space-y-4">
                    <div className="relative">
                      <Button
                        variant="outline"
                        onClick={() => setIsVariantOpen(!isVariantOpen)}
                        className="w-full justify-between text-left h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <span>ELIGE TUS NIGIRIS</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isVariantOpen ? "rotate-180" : ""}`} />
                      </Button>

                      <AnimatePresence>
                        {isVariantOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                          >
                            {product.variants.map((variant, index) => (
                              <motion.div
                                key={variant}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-4 py-3 border-b last:border-b-0 flex items-center justify-between"
                              >
                                <span className="text-gray-700 flex-1">{variant}</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleVariantQuantityChange(variant, -1)}
                                    disabled={!variantQuantities[variant]}
                                    className="w-8 h-8 rounded-full"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">
                                    {variantQuantities[variant] || 0}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleVariantQuantityChange(variant, 1)}
                                    className="w-8 h-8 rounded-full"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Resumen de selección */}
                    {Object.keys(variantQuantities).some((key) => variantQuantities[key] > 0) && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Tu selección:</h4>
                        {Object.entries(variantQuantities)
                          .filter(([_, qty]) => qty > 0)
                          .map(([variant, qty]) => (
                            <div key={variant} className="flex justify-between text-sm text-blue-700">
                              <span>{variant}</span>
                              <span>{qty} unidades</span>
                            </div>
                          ))}
                        <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between font-semibold text-blue-800">
                          <span>Total:</span>
                          <span>{getTotalQuantity()} unidades</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Modal simple para productos con una sola variante
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setIsVariantOpen(!isVariantOpen)}
                      className="w-full justify-between text-left h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <span>{selectedVariant || "ELIGE UNA OPCIÓN"}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isVariantOpen ? "rotate-180" : ""}`} />
                    </Button>

                    <AnimatePresence>
                      {isVariantOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-600 rounded-lg shadow-lg z-10"
                        >
                          {product.variants.map((variant, index) => (
                            <motion.button
                              key={variant}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => {
                                setSelectedVariant(variant)
                                setIsVariantOpen(false)
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors"
                            >
                              <span className="text-gray-700">{variant}</span>
                              <Plus className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2">
              <Textarea
                placeholder="¿Tienes alguna instrucción para tu pedido?"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[80px] resize-none border-gray-200 focus:border-blue-600"
              />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between">
              {!isMultipleVariantProduct && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border-2"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-full border-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={getTotalQuantity() === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-50"
              >
                AGREGAR S/ {getTotalPrice().toFixed(2)}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
