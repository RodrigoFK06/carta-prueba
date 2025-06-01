"use client"

import { useState } from "react" // Removed useEffect as menuData is no longer managed here
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Package, Tag, ImageIcon, BarChart } from "lucide-react" // Added BarChart
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryManager from "./category-manager"
import ProductManager from "./product-manager"
import AnalyticsViewer from "./analytics-viewer" // Added AnalyticsViewer import
// import { getMenuData, saveMenuData } from "@/lib/admin-storage" // Removed as data is now in server actions

interface AdminPanelProps {
  onBack: () => void
}

type AdminView = "dashboard" | "categories" | "products" | "analytics" // Added "analytics"

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard")
  // const [menuData, setMenuData] = useState<any>({}) // Removed menuData state

  // useEffect(() => { // Removed useEffect for menuData
  //   const data = getMenuData()
  //   setMenuData(data)
  // }, [])

  // const handleDataUpdate = (newData: any) => { // Removed handleDataUpdate
  //   setMenuData(newData)
  //   saveMenuData(newData)
  // }

  const renderView = () => {
    switch (currentView) {
      case "categories":
        return <CategoryManager /> // Removed props
      case "products":
        return <ProductManager /> // Removed props
      case "analytics":
        return <AnalyticsViewer />
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Manager Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                onClick={() => setCurrentView("categories")}
              >
                <CardHeader className="text-center">
                  <Tag className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                  <CardTitle>Gestionar Categorías</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-center">Agregar, editar o eliminar categorías del menú.</p>
                  {/* Info dynamic count removed as it's not readily available without fetching */}
                </CardContent>
              </Card>
            </motion.div>

            {/* Product Manager Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                onClick={() => setCurrentView("products")}
              >
                <CardHeader className="text-center">
                  <Package className="w-12 h-12 mx-auto text-green-600 mb-2" />
                  <CardTitle>Gestionar Productos</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-center">Agregar, editar o eliminar productos y sus variantes.</p>
                   {/* Info dynamic count removed */}
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Viewer Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                onClick={() => setCurrentView("analytics")}
              >
                <CardHeader className="text-center">
                  <BarChart className="w-12 h-12 mx-auto text-indigo-600 mb-2" />
                  <CardTitle>Ver Analíticas</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-center">Visualizar estadísticas de productos y ventas.</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Image Manager Card (Placeholder) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
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
