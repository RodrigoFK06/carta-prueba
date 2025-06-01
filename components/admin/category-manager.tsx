"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"

interface CategoryManagerProps {
  menuData: any
  onUpdate: (newData: any) => void
}

export default function CategoryManager({ menuData, onUpdate }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const updatedData = {
        ...menuData,
        [newCategoryName.trim()]: [],
      }
      onUpdate(updatedData)
      setNewCategoryName("")
    }
  }

  const handleDeleteCategory = (categoryName: string) => {
    const updatedData = { ...menuData }
    delete updatedData[categoryName]
    onUpdate(updatedData)
  }

  const handleEditCategory = (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName) {
      const updatedData = { ...menuData }
      updatedData[newName] = updatedData[oldName]
      delete updatedData[oldName]
      onUpdate(updatedData)
    }
    setEditingCategory(null)
    setEditingName("")
  }

  const startEditing = (categoryName: string) => {
    setEditingCategory(categoryName)
    setEditingName(categoryName)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Categorías</h2>

        {/* Add new category */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Nombre de nueva categoría"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1"
          />
          <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>

        {/* Categories list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(menuData).map(([categoryName, items]: [string, any]) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
            >
              <Card>
                <CardHeader className="pb-3">
                  {editingCategory === categoryName ? (
                    <div className="flex gap-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="text-sm"
                        onKeyPress={(e) => e.key === "Enter" && handleEditCategory(categoryName, editingName)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditCategory(categoryName, editingName)}
                        className="h-8 w-8"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingCategory(null)} className="h-8 w-8">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{categoryName}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditing(categoryName)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteCategory(categoryName)}
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">{items?.length || 0}</span>
                    <p className="text-sm text-gray-500">productos</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
