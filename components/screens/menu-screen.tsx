"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronUp } from "lucide-react"
import MenuCategory from "@/components/menu/menu-category"
import CartDrawer from "@/components/cart/cart-drawer"
import { menuData } from "@/lib/menu-data"
import ProductDetailModal from "@/components/modals/product-detail-modal"

// Agregar onBack prop al interface
interface MenuScreenProps {
  customerName: string
  orderType: "local" | "takeaway"
  onBack: () => void
}

const categories = Object.keys(menuData)

// Actualizar el componente para usar onBack
export default function MenuScreen({ customerName, orderType, onBack }: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState("PROMOS")
  const [cart, setCart] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null) // Nuevo estado
  const [isProductModalOpen, setIsProductModalOpen] = useState(false) // Nuevo estado

  // Función para abrir modal de producto
  const handleItemClick = (item: any) => {
    setSelectedProduct(item)
    setIsProductModalOpen(true)
  }

  // Función actualizada para agregar al carrito desde el modal
  const addToCart = (item: any, quantity = 1, selectedVariant?: string, instructions?: string) => {
    const cartItem = {
      ...item,
      quantity,
      selectedVariant,
      instructions,
      cartId: `${item.id}-${selectedVariant || "default"}-${Date.now()}`,
    }

    setCart((prev) => [...prev, cartItem])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-40 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* En el botón de atrás del header, cambiar: */}
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="text-sm">
              <span className="font-semibold">NT TACO</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-blue-600">¡Hola, {customerName}!</div>
            <div className="text-xs text-gray-500">¿Qué se te antoja hoy?</div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto px-4 pb-2 gap-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap ${
                activeCategory === category ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="pb-24">
        <MenuCategory
          category={activeCategory}
          items={menuData[activeCategory] || []}
          onItemClick={handleItemClick} // Cambiar de onAddToCart a onItemClick
        />
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
        >
          <Button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {getTotalItems()}
              </div>
              <span>Mi Pedido</span>
            </div>
            <div className="flex items-center gap-2">
              <span>S/ {getTotalPrice().toFixed(2)}</span>
              <ChevronUp className="w-5 h-5" />
            </div>
          </Button>
        </motion.div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
    </motion.div>
  )
}
