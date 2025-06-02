"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { recordProductClickAction } from "@/app/actions/menuActions"

interface MenuItemCardProps {
  item: {
    id: string
    name: string
    description: string
    price: string // Changed from number to string
    image: string
    category: string
    variants?: string[]
  }
  onItemClick: (item: any) => void // Cambiar de onAddToCart a onItemClick
}

export default function MenuItemCard({ item, onItemClick }: MenuItemCardProps) {
  const getCardColor = () => {
    switch (item.category) {
      case "HAND ROLLS X2":
        return "bg-red-400"
      case "NT BOWLS":
        return "bg-gray-300"
      default:
        return "bg-blue-100"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className={`h-32 ${getCardColor()} relative overflow-hidden`}>
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">S/ {parseFloat(item.price).toFixed(2)}</span>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3">
            <Button
              onClick={() => {
                recordProductClickAction(item.id).then(response => {
                  if (!response.success) {
                    console.warn(`Failed to record click for ${item.id}: ${response.error}`);
                  }
                });
                onItemClick(item);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2"
            >
              ¡LO QUIERO!
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
