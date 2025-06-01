"use client"

import { motion } from "framer-motion"
import MenuItemCard from "./menu-item-card"

interface MenuCategoryProps {
  category: string
  items: any[]
  onItemClick: (item: any) => void // Cambiar nombre
}

export default function MenuCategory({ category, items, onItemClick }: MenuCategoryProps) {
  return (
    <div className="p-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-gray-800 mb-6"
      >
        {category}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MenuItemCard item={item} onItemClick={onItemClick} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
