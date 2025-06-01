"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"

interface ProductManagerProps {
  menuData: any
  onUpdate: (newData: any) => void
}

export default function ProductManager({ menuData, onUpdate }: ProductManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    variants: "",
    type: "single",
  })

  const handleAddProduct = () => {
    if (!selectedCategory || !newProduct.name.trim()) return

    const productId = `${selectedCategory.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
    const variants = newProduct.variants.trim() ? newProduct.variants.split(",").map((v) => v.trim()) : []

    const product = {
      id: productId,
      name: newProduct.name.trim(),
      description: newProduct.description.trim(),
      price: Number.parseFloat(newProduct.price) || 0,
      image: newProduct.image.trim() || "/placeholder.svg?height=200&width=300",
      category: selectedCategory,
      variants: variants.length > 0 ? variants : undefined,
      type: newProduct.type,
    }

    const updatedData = {
      ...menuData,
      [selectedCategory]: [...(menuData[selectedCategory] || []), product],
    }

    onUpdate(updatedData)
    setNewProduct({ name: "", description: "", price: "", image: "", variants: "", type: "single" })
    setShowAddForm(false)
  }

  const handleDeleteProduct = (categoryName: string, productId: string) => {
    const updatedData = {
      ...menuData,
      [categoryName]: menuData[categoryName].filter((p: any) => p.id !== productId),
    }
    onUpdate(updatedData)
  }

  const handleUpdateProduct = (categoryName: string, productId: string, updatedProduct: any) => {
    const updatedData = {
      ...menuData,
      [categoryName]: menuData[categoryName].map((p: any) => (p.id === productId ? { ...p, ...updatedProduct } : p)),
    }
    onUpdate(updatedData)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestionar Productos</h2>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        {/* Add Product Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-4">Nuevo Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(menuData).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Descripción del producto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio (S/)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Modal</label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Simple (una variante)</SelectItem>
                      <SelectItem value="multiple">Múltiple (contadores por variante)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Variantes (separadas por comas)</label>
                  <Input
                    value={newProduct.variants}
                    onChange={(e) => setNewProduct({ ...newProduct, variants: e.target.value })}
                    placeholder="Picante, Suave, Extra Sésamo"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">URL de Imagen</label>
                  <Input
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="/placeholder.svg?height=200&width=300"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddProduct} disabled={!selectedCategory || !newProduct.name.trim()}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products by Category */}
        {Object.entries(menuData).map(([categoryName, products]: [string, any]) => (
          <div key={categoryName} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{categoryName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((product: any) => (
                <motion.div key={product.id} layout>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">S/ {product.price.toFixed(2)}</p>
                          {product.variants && (
                            <p className="text-xs text-gray-500 mt-1">Variantes: {product.variants.join(", ")}</p>
                          )}
                          <p className="text-xs text-purple-600 mt-1">
                            Tipo: {product.type === "multiple" ? "Múltiple" : "Simple"}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingProduct(product.id)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(categoryName, product.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
