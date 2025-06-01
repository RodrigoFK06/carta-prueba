"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Package, Tag, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryManager from "./category-manager"
import ProductManager from "./product-manager"
import { getMenuData, saveMenuData } from "@/lib/admin-storage"

interface AdminPanelProps {
  onBack: () => void
}

type AdminView = "dashboard" | "categories" | "products"

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard")
  const [menuData, setMenuData] = useState<any>({})

  useEffect(() => {
    const data = getMenuData()
    setMenuData(data)
  }, [])

  const handleDataUpdate = (newData: any) => {
    setMenuData(newData)
    saveMenuData(newData)
  }

  const renderView = () => {
    switch (currentView) {
      case "categories":
        return <CategoryManager menuData={menuData} onUpdate={handleDataUpdate} />
      case "products":
        return <ProductManager menuData={menuData} onUpdate={handleDataUpdate} />
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView("categories")}
              >
                <CardHeader className="text-center">
                  <Tag className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                  <CardTitle>Gestionar Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Agregar, editar o eliminar categorías del menú</p>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-bold text-blue-600">{Object.keys(menuData).length}</span>
                    <p className="text-sm text-gray-500">Categorías activas</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView("products")}
              >
                <CardHeader className="text-center">
                  <Package className="w-12 h-12 mx-auto text-green-600 mb-2" />
                  <CardTitle>Gestionar Productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Agregar, editar productos y sus variantes</p>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-bold text-green-600">
                      {Object.values(menuData).reduce((total: number, items: any) => total + (items?.length || 0), 0)}
                    </span>
                    <p className="text-sm text-gray-500">Productos totales</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                  <CardTitle>Gestionar Imágenes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Subir y gestionar imágenes de productos</p>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-bold text-purple-600">∞</span>
                    <p className="text-sm text-gray-500">Próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={currentView === "dashboard" ? onBack : () => setCurrentView("dashboard")}
              className="w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
              <p className="text-sm text-gray-600">NT TACO - Modo Construcción</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Admin</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{renderView()}</div>
    </motion.div>
  )
}
